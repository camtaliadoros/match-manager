import { useRouter } from 'next/router';

export default function NotFound({ type }) {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  return (
    <>
      <h2>This {type} doesn't exist.</h2>
      <button onClick={handleClick}>GO BACK</button>
    </>
  );
}
