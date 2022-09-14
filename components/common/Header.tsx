import styles from "../../styles/HeaderStyles.module.css";
import { useSession, signIn, signOut } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <header className={styles.header}>
        <p>
          Paper Trail - Signed in as {session.user.email}
          <button onClick={() => signOut()}>Sign out</button>
        </p>
      </header>
    );
  } else {
    return (
      <header className={styles.header}>
        <p>
          Paper Trail <button onClick={() => signIn()}>Sign In</button>
        </p>
      </header>
    );
  }
};

export default Header;
