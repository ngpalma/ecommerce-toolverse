import React, { useEffect } from "react";
import Card from "../Card/Card";
import style from "./ProductCards.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getTools } from "../../../redux/actions";
import Pagination from "../../Pagination/Pagination";

const ProductCards = () => {
  const allTools = useSelector((state) => state.toolsShown);
  const currentPage = useSelector((state) => state.currentPage);
  const itemsPerPage = 12;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTools());
  }, [dispatch]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const toolsToShow = allTools.slice(startIndex, endIndex);

  return (
    <div className={style.pageWrapper}>
      <Pagination />
      {toolsToShow.length === 0 ? (
        <p className={style.empty}>No hay herramientas para mostrar en esta página.</p>
      ) : (
        <div className={style.container}>
          {toolsToShow.map((tool) => (
            <Card key={tool.id} {...tool} />
          ))}
        </div>
      )}
      <Pagination />
    </div>
  );
};

export default ProductCards;
