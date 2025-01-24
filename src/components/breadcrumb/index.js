import React from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { Link } from "react-router-dom";
import "./breadcrumb.css";

const Breadcrumb = ({linkAnterior, tituloAnterior, linkProximo, tituloProximo}) => {

    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-light border rounded-pill p-2 shadow-sm d-flex align-items-center justify-content-between">
                    <li className="breadcrumb-item text-success "><Link to={linkAnterior}><GrFormPrevious color="black" />{tituloAnterior}</Link></li>
                    <li className="breadcrumb-item"><Link to={linkProximo}>{tituloProximo} <GrFormNext color="black"/></Link></li>
                </ol>
            </nav>
        </>
    );
};

export default Breadcrumb;
