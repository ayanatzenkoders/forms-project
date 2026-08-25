import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Select Form</h1>
      <ul>
        <li>
          <Link href="/jades-profile">Jades</Link>
        </li>
        {/* <li>
          <Link href="/milcoach-profile">MilCoach</Link>
        </li>
        <li>
          <Link href="/practioner-profile">Practioner</Link>
        </li> */}
      </ul>
    </div>
  );
}
