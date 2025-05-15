export default function ForgetPasswordMailTemplate({ url }: { url: string }) {
  return (
    <div>
      <h1>ForgetPassword</h1>
      <p>
        Click on the link to reset your password <a href={url}>{url}</a>
      </p>
    </div>
  );
}
