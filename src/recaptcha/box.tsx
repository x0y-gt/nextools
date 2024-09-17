import ReCAPTCHA from "react-google-recaptcha";

interface ReCaptchaBoxProps extends React.HTMLProps<HTMLDivElement> {
  sitekey: string;
  onVerify: (token: string | null) => void;
}

export default function ReCaptchaBox({
  sitekey,
  onVerify,
  ...props
}: ReCaptchaBoxProps) {
  return (
    <ReCAPTCHA
      className="g-recaptcha w-full"
      sitekey={sitekey}
      onChange={onVerify}
      size="normal"
      {...props}
    />
  );
}
