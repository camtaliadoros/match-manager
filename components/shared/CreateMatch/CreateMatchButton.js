import { useRouter } from 'next/router';

export default function CreateMatchButton() {
  const router = useRouter();

  const handleClick = () => {
    // Check if user is admin of at least one group
    // If yes
    router.push('/matches/create-match');
    //If not, open dialog to prompt create group
  };

  return <button onClick={handleClick}>Create Match</button>;
}
