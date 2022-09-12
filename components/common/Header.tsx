import styles from "./HeaderStyles.module.css";
import { useSession, signIn, signOut } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        {" "}
        Signed in as {session.user.email} <br />{" "}
        <button onClick={() => signOut()}>Sign out</button>{" "}
      </>
    );
  } else {
    return (
      <>
        <header className={styles.header}>
          <p>Paper Trail</p>
        </header>
        <button onClick={() => signIn()}>Sign In</button>{" "}
      </>
    );
  }
};

export default Header;
