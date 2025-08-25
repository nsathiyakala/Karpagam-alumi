import React from "react";
import Register from "./register.component";
import { useSetState } from "@/utils/commonFunction.utils";
import Otp from "./otp.component";

export default function SignInMain() {
  const [state, setState] = useSetState({
    step: 1,
    memberId: null,
    email: "",
  });
  return state.step == 2 ? (
    <Register
      updateStep={(memberId, email) =>
        setState({ step: 2, memberId: memberId, email: email })
      }
    />
  ) : state.step == 1 ? (
    <Otp
      updateStep={() => {
        setState({ step: 3 });
      }}
      memberEmail={state.email}
    />
  ) : null;
}
