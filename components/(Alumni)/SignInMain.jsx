import React from "react";
import Register from "./register.component";
import { useSetState } from "@/utils/commonFunction.utils";
import Otp from "./otp.component";
import MemberData from "./memberData";

export default function SignInMain() {
  const [state, setState] = useSetState({
    step: 1,
    memberId: null,
    email: "",
  });
  return state.step == 3 ? (
    <Register
      updateStep={(memberId, email) =>
        setState({ step: 2, memberId: memberId, email: email })
      }
    />
  ) : state.step == 2 ? (
    <Otp
      updateStep={() => {
        setState({ step: 3 });
      }}
      memberEmail={state.email}
    />
  ) : state.step == 1 ? (
    <MemberData
      updateStep={(memberId, email) =>
        setState({ step: 2, memberId: memberId, email: email })
      }
    />
  ):null;
}
