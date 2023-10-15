import { signIn } from "next-auth/react";
import React from "react";

export default function signInPage() {
  return (
    <div onClick={() => signIn("google", { redirect: false })}>signIn</div>
  );
}
