# Psyoc

Psyoc is a TikTok-only social media scheduling product. It lets you connect a
TikTok account, compose and preview posts, and schedule them to publish
automatically. The marketing site is [psyoc.com](https://psyoc.com) and the app
runs at [app.psyoc.com](https://app.psyoc.com).

## Relationship to Postiz

Psyoc is a rebranded fork of [Postiz](https://github.com/gitroomhq/postiz-app),
an open-source social media scheduling tool. Psyoc keeps the Postiz engine and
narrows the user-facing product to a single network, TikTok. The rename is
display-only: it changes the product name, icon, and user-facing copy. It does
not change the underlying license, code identifiers, or package names.

## License and source offer

Psyoc is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0),
the same license as upstream Postiz. The full text is in [LICENSE](./LICENSE).

In accordance with AGPL-3.0 section 13, the complete corresponding source code
of the version running as a network service is offered to all users. This
repository, [github.com/blackplate/psyoc-app](https://github.com/blackplate/psyoc-app),
is that source. Upstream Postiz remains available at
[github.com/gitroomhq/postiz-app](https://github.com/gitroomhq/postiz-app).

All upstream copyright notices and license headers are preserved. The trademark
rebrand does not remove or alter them.

## Self-hosting

The application code lives here, but deployment configuration (environment
variables, secrets, container orchestration, DNS, and TLS) lives in the
operator's separate infrastructure repository and is not published with the
app source. To run your own copy you supply your own configuration, including
the email sender identity (`EMAIL_FROM_NAME`, `EMAIL_FROM_ADDRESS`), database,
and object storage. Refer to the upstream Postiz documentation for the base
setup, then apply your own environment.

## Support

Questions and support requests go to [psyoc.com/support](https://psyoc.com/support/).
