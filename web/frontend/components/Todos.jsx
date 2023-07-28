import {useEffect, useState} from "react";
import { Card, TextContainer, Text } from "@shopify/polaris";
import { useTranslation } from "react-i18next";
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


export function Todos() {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const [user, setUser] = useState()
  const [todos, setTodos] = useState([])

  useEffect(() => {
    return getAuth().onAuthStateChanged((user) => {
      if (user) setUser(user)
    })
  }, []);

  useEffect(() => {
    if (!user) return
    const q = query(collection(getFirestore(), 'todos'), where('uid', '==', user.uid));
    return onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => doc.data());
      setTodos([...data])
    })
  }, [user]);


  const handlePopulate = async () => {
    setIsLoading(true);

    try {
      await addDoc(collection(getFirestore(), 'todos'), {
        text: `todo ${Date.now()}`,
        uid: user.uid,
        timestamp: serverTimestamp(),
      });
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card
        title={t("ProductsCard.title")}
        sectioned
        primaryFooterAction={{
          content: t("Create Todos"),
          onAction: handlePopulate,
          loading: isLoading,
        }}
      >
        <TextContainer spacing="loose">
          <p>{t("Todos")}</p>
          <ol>
            {todos.map((todo) => (
              <li key={todo.timestamp}>{todo.text}</li>
            ))}
          </ol>
        </TextContainer>
      </Card>
    </>
  );
}
