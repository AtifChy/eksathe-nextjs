# Private object storage setup

Create a private S3-compatible bucket and add these values to the server environment: `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, and optionally `S3_ENDPOINT` for R2 or MinIO. Do not enable public bucket access or put storage credentials in `NEXT_PUBLIC_*` variables.

The browser uploads directly to a five-minute, content-type and content-length constrained presigned URL. Configure the bucket CORS policy to allow `PUT` from the deployed app origin and local development origin, with the `Content-Type` request header. Reads use 60-second signed URLs returned only after listing, project, or payment access checks.

Listing images accept JPEG, PNG, and WebP up to 5 MB. Project documents accept PDF up to 10 MB. Payment receipts accept JPEG, PNG, WebP, or PDF up to 10 MB. The server checks object size, content type, and file signature before it stores an attachment record. Unattached uploads can remain when a user abandons a form; configure a bucket lifecycle rule to remove old objects that remain unattached if storage costs require it.
