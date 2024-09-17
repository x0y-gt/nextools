export default async function verifyToken(secretKey: string, token: string) {
  const result = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
    {
      method: "POST",
    },
  );

  const json = await result.json();

  return json.success;
}
