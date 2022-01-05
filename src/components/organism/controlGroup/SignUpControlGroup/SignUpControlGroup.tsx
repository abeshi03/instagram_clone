// - ライブラリー ========================================================================================================
import React, { memo, VFC, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../firebase";
import { SubmitHandler, useForm } from "react-hook-form";

// - グローバルstate =====================================================================================================
import { useDispatch } from "react-redux";
import { displayFloatingNotificationBar } from "../../../../features/floatingNotificationBar/floatingNotificationBarSlice";

// - ルーティング ========================================================================================================
import { useNavigate } from "react-router-dom";
import { Routing } from "../../../../router/routing";

// - アセット ===========================================================================================================
import styles from "./SignUpControlGroup.module.scss";

// - 子コンポーネント =====================================================================================================
import { InputField } from "../../../atoms/control/InputField/InputField";
import { LoadingOverlay } from "../../../atoms/LoadingOverlay/LoadingOverlay";

// - バリデーション =======================================================================================================
import {
  userValidations,
  emailErrorMessages,
  passwordErrorMessages
} from "../../../../config/validations/userValidations";

// - inputState ========================================================================================================
export type SignUpInputValues = {
  email: string,
  password: string
};
// - ===================================================================================================================


export const SignUpControlGroup: VFC = memo(() => {

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpInputValues>();

  const [ isDisabled, setIsDisabled ] = useState(false);
  const [ isDisplayLoadingOverlay, setIsDisplayLoadingOverlay ] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const signUp: SubmitHandler<SignUpInputValues> = (inputValue) => {

    setIsDisabled(true);
    setIsDisplayLoadingOverlay(true);

    createUserWithEmailAndPassword(auth, inputValue.email, inputValue.password)
      .then(() => {
        navigate(Routing.top.path);
        dispatch(displayFloatingNotificationBar({
          notification: {
            type: "SUCCESS",
            message: "会員登録が完了いたしました！"
          }
        }))
      })
      .catch((error) => {
        console.error(error.code, error.message);
        dispatch(displayFloatingNotificationBar({
          notification: {
            type: "ERROR",
            message: "登録されているメールアドレスです"
          }
        }))
      })
      .finally(() => {
        setIsDisabled(false);
        setIsDisplayLoadingOverlay(false);
      })
  }


  return (
    <>
      <form className={styles.signInControlGroup} onSubmit={handleSubmit(signUp)}>

        <div className={styles.inputContainer}>
          <InputField
            type="email"
            required={userValidations.email.required}
            label="メールアドレス"
            placeholder="メールアドレスを入力してください"
            inputProps={register("email",{
              required: userValidations.email.required,
              pattern: userValidations.email.regexp
            })}
            autoComplete="email"
          />
          {errors.email && emailErrorMessages(errors.email)}
        </div>

        <div className={styles.inputContainer}>
          <InputField
            type="password"
            required={userValidations.password.required}
            label="パスワード"
            guidance={`※パスワードは最低${userValidations.password.minLength}文字以上で入力してください`}
            placeholder="パスワードを入力してください"
            inputProps={register("password", {
              required: userValidations.password.required,
              minLength: userValidations.password.minLength,
              maxLength: userValidations.password.maxLength
            })}
            autoComplete="new-password"
          />
          {errors.password && passwordErrorMessages(errors.password)}
        </div>

        <button type="submit" disabled={isDisabled}>送信</button>

      </form>

      { isDisplayLoadingOverlay && <LoadingOverlay /> }
    </>
  );
});
