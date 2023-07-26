import { Card, TextContainer  } from "@shopify/polaris";
import { useTranslation } from "react-i18next";
import { useAppQuery } from "../hooks";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { useEffect, useState } from "react";

export function User() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);

  const { data } = useAppQuery({
    url: "/api/auth/token",
  });

  useEffect(() => {
    if (!data) return;
    const auth = getAuth();
    signInWithCustomToken(auth, data.token)
      .then((userCredential) => {
        setUser(userCredential.user);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [data, setUser]);

  return (
    <>
      <Card title={t("User (Shop) Info")} sectioned>
        <TextContainer spacing="loose">
          <pre style={{overflow: "auto"}}>
            {user && JSON.stringify(user, null, 2)}
          </pre>
        </TextContainer>
      </Card>
    </>
  );
}
