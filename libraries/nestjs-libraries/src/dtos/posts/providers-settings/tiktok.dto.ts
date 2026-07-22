import {
  IsBoolean,
  ValidateIf,
  IsIn,
  IsString,
  MaxLength,
  IsOptional,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

// TikTok rejects branded content (brand_content_toggle) published with private
// (SELF_ONLY) visibility, so the choice is invalid at save time and the post
// button stays blocked until the user picks a public / friends option. This
// mirrors the frontend hint; it is the enforcement half of that guideline.
function BrandedContentNotPrivate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'brandedContentNotPrivate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const dto = args.object as TikTokDto;
          return !(dto.brand_content_toggle && value === 'SELF_ONLY');
        },
        defaultMessage() {
          return 'Branded content visibility cannot be set to private (Only me).';
        },
      },
    });
  };
}

// When the commercial-content disclosure toggle is on, TikTok requires the user
// to indicate whether the content promotes their own brand, a third party, or
// both; with neither selected the post is invalid and the publish button stays
// blocked. `disclose` is a UI-only flag that already rides along in the post
// settings, so we read it here without declaring it as a stored field. Skipped
// for UPLOAD, where TikTok ignores disclosure entirely.
function DisclosureRequiresBrand(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'disclosureRequiresBrand',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(_value: any, args: ValidationArguments) {
          const dto = args.object as TikTokDto & { disclose?: boolean };
          if (dto.content_posting_method === 'UPLOAD') return true;
          if (!dto.disclose) return true;
          return !!(dto.brand_organic_toggle || dto.brand_content_toggle);
        },
        defaultMessage() {
          return 'You need to indicate if your content promotes yourself, a third party, or both.';
        },
      },
    });
  };
}

// TikTok only honors most of these settings on a DIRECT_POST. With
// content_posting_method=UPLOAD the media lands in the user's TikTok inbox as a
// draft, and TikTok's inbox/upload endpoints accept nothing but the title /
// description - every other field below is silently discarded.
// video_made_with_ai / duet / stitch are additionally video-only: TikTok's photo
// post_info has no is_aigc, disable_duet or disable_stitch field.
// Fields stay required here (existing clients depend on it); the constraints are
// documented, not enforced.
export class TikTokDto {
  @ValidateIf((p) => p.title)
  @MaxLength(90)
  @JSONSchema({
    description:
      'Used as the title of the post. The only setting TikTok keeps when content_posting_method=UPLOAD.',
  })
  title: string;

  // Required for a DIRECT_POST and must be the user's explicit choice - TikTok
  // guidelines forbid a preselected default. Skipped for UPLOAD, where TikTok
  // ignores privacy entirely. Must be one of the privacy_level_options the
  // creator_info API returns for the account, and cannot be SELF_ONLY when the
  // post is branded content.
  @ValidateIf((p) => p.content_posting_method !== 'UPLOAD')
  @IsIn([
    'PUBLIC_TO_EVERYONE',
    'MUTUAL_FOLLOW_FRIENDS',
    'FOLLOWER_OF_CREATOR',
    'SELF_ONLY',
  ])
  @IsString()
  @BrandedContentNotPrivate()
  @JSONSchema({
    description:
      'Required for content_posting_method=DIRECT_POST and must come from the ' +
      "user's explicit choice (no default). Must be one of the " +
      'privacy_level_options returned by TikTok creator_info for the account. ' +
      'Branded content (brand_content_toggle=true) cannot be SELF_ONLY. ' +
      'Ignored by TikTok on UPLOAD.',
  })
  privacy_level:
    | 'PUBLIC_TO_EVERYONE'
    | 'MUTUAL_FOLLOW_FRIENDS'
    | 'FOLLOWER_OF_CREATOR'
    | 'SELF_ONLY';

  @IsBoolean()
  @JSONSchema({
    description:
      'Video posts only, and only when content_posting_method=DIRECT_POST. TikTok has no duet setting for photo posts.',
  })
  duet: boolean;

  @IsBoolean()
  @JSONSchema({
    description:
      'Video posts only, and only when content_posting_method=DIRECT_POST. TikTok has no stitch setting for photo posts.',
  })
  stitch: boolean;

  @IsBoolean()
  @JSONSchema({
    description:
      'Applied only when content_posting_method=DIRECT_POST. Ignored by TikTok on UPLOAD.',
  })
  comment: boolean;

  @IsIn(['yes', 'no'])
  @JSONSchema({
    description:
      'Photo posts only, and only when content_posting_method=DIRECT_POST. Ignored by TikTok on UPLOAD.',
  })
  autoAddMusic: 'yes' | 'no';

  @IsBoolean()
  @DisclosureRequiresBrand()
  @JSONSchema({
    description:
      'Applied only when content_posting_method=DIRECT_POST. Ignored by TikTok on UPLOAD.',
  })
  brand_content_toggle: boolean;

  @IsBoolean()
  @IsOptional()
  @JSONSchema({
    description:
      'Labels the post as AI generated. Video posts only, and only when content_posting_method=DIRECT_POST. TikTok has no AI-generated label for photo posts, and discards it on UPLOAD.',
  })
  video_made_with_ai: boolean;

  @IsBoolean()
  @JSONSchema({
    description:
      'Applied only when content_posting_method=DIRECT_POST. Ignored by TikTok on UPLOAD.',
  })
  brand_organic_toggle: boolean;

  @IsIn(['DIRECT_POST', 'UPLOAD'])
  @IsString()
  @JSONSchema({
    description:
      'Required. Use "DIRECT_POST" to actually publish the post to TikTok. ' +
      '"UPLOAD" does NOT publish: it only sends the media to the user\'s TikTok app inbox, ' +
      'where they must manually finish and publish it within 24 hours or it is discarded, ' +
      'and it makes TikTok ignore every other setting here. ' +
      'Only use "UPLOAD" when the user explicitly asks to review or edit the post inside the TikTok app before publishing.',
  })
  content_posting_method: 'DIRECT_POST' | 'UPLOAD';
}
