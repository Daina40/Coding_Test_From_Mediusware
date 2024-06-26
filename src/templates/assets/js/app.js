import React from "react";
import ReactDOM from "react-dom";
import CreateProduct from "./components/CreateProduct";

const propsContainer = document.getElementById("variants");
const props = Object.assign({}, propsContainer.dataset);

ReactDOM.render(
    <React.StrictMode>
        <CreateProduct {...props} />
    </React.StrictMode>,
    document.getElementById('root')
);
