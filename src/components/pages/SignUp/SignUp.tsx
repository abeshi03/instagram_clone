// - フレームワーク =======================================================================================================
import React, { memo, VFC } from "react";

// - アセット ===========================================================================================================
import styles from "./SignUp.module.scss";

// - 子コンポーネント =====================================================================================================
import { SignUpControlGroup } from "../../organism/controlGroup/SignUpControlGroup/SignUpControlGroup";


export const SignUp: VFC = memo(() => {

  return (
    <div className={styles.signUp}>
      <h1>SignUpページです</h1>
      <SignUpControlGroup/>
    </div>
  );
});
