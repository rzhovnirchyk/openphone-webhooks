import { Request, Response, NextFunction } from 'express';
import { createHmac } from 'crypto';

function isKeyValid(req: Request) {

  // signingKey is from "Reveal Signing Secret" in the OpenPhone app.
  const signingKey: string = process.env.OPENPHONE_KEY || '';

  // req is the HTTP request object (this example uses express).
  const signature: any = req.headers['openphone-signature'] || ''
  const payload = req.body

  if (!signingKey || !signature || !payload) return false;

  // Parse the fields from the openphone-signature header.
  const fields = signature.split(';')
  const timestamp = fields[2]
  const providedDigest = fields[3]

  // Compute the data covered by the signature.
  const signedData = timestamp + '.' + JSON.stringify(payload)

  // Convert the base64-encoded signing key to binary.
  const signingKeyBinary = Buffer.from(signingKey, 'base64').toString('binary')

  // Compute the SHA256 HMAC digest.
  // Obtain the digest in base64-encoded form for easy comparison with
  // the digest provided in the openphone-signature header.
  const computedDigest = createHmac('sha256', signingKeyBinary)
    .update(Buffer.from(signedData, 'utf8'))
    .digest('base64')

  // Make sure the computed digest matches the digest in the openphone header.
  return providedDigest === computedDigest;
}

export function verifyOpenPhoneKey(req: Request, res: Response, next: NextFunction) {
  const isValid: boolean = isKeyValid(req);

  if (!isValid) {
    return res.status(401).send('Unauthorized');
  }

  next();
}