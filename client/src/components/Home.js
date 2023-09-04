import { useRef } from "react";
import HeroSection from "./HeroSection";
import graphBackground from "../images/graph-background.jpeg";
import productsBackground from "../images/products-background.jpg";
import addProductBackground from "../images/add-product-background.jpg";
import ExpensesCard from "./cards/ExpensesCard";

export default function Home() {
  const bottomRef = useRef();

  function onClick() {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <HeroSection onClick={onClick} />
      <section className="d-flex flex-row mb-5" ref={bottomRef}>
        <ExpensesCard
          width="30%"
          bgColor="rgba(0,0,0,0.7)"
          imageSrc={addProductBackground}
          title="Add expenses"
          text="You can add your expenses here"
          path="/profile/add-expenses"
          linkTxt="Add expenses"
        />
        <ExpensesCard
          width="30%"
          bgColor="rgba(0,0,0,0.7)"
          imageSrc={productsBackground}
          title="Expenses"
          text="You can see your expenses here"
          path="/profile/expenses"
          linkTxt="Go to expenses"
        />
        <ExpensesCard
          width="30%"
          bgColor="rgba(0,0,0,0.7)"
          imageSrc={graphBackground}
          title="Graph"
          text="You can see your expenses's graph here"
          path="/profile/expenses/graph"
          linkTxt="Go to graph"
        />
      </section>
    </>
  );
}
