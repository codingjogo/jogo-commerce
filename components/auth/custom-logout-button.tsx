import { useClerk } from '@clerk/clerk-react';
import { Button } from '../ui/button';

const CustomLogoutButton = () => {
  const { signOut } = useClerk(); // Get the signOut function from Clerk's API

  const handleLogout = async () => {
    try {
      await signOut();
      // Optionally, redirect or show a confirmation message here
      console.log('You have logged out!');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Button variant={'destructive'} onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default CustomLogoutButton;
