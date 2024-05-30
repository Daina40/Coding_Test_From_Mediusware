import React, { useState } from 'react';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import Dropzone from 'react-dropzone';
import axios from 'axios';

const CreateProduct = (props) => {
    const [productVariantPrices, setProductVariantPrices] = useState([]);
    const [productVariants, setProductVariant] = useState([{ option: 1, tags: [] }]);
    const [productName, setProductName] = useState("");
    const [productSKU, setProductSKU] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState([]);

    const handleAddClick = () => {
        let all_variants = JSON.parse(props.variants.replaceAll("'", '"')).map(el => el.id);
        let selected_variants = productVariants.map(el => el.option);
        let available_variants = all_variants.filter(entry1 => !selected_variants.some(entry2 => entry1 === entry2));
        setProductVariant([...productVariants, { option: available_variants[0], tags: [] }]);
    };

    const handleInputTagOnChange = (value, index) => {
        let product_variants = [...productVariants];
        product_variants[index].tags = value;
        setProductVariant(product_variants);
        checkVariant();
    };

    const removeProductVariant = (index) => {
        let product_variants = [...productVariants];
        product_variants.splice(index, 1);
        setProductVariant(product_variants);
    };

    const checkVariant = () => {
        let tags = [];
        productVariants.forEach((item) => {
            tags.push(item.tags);
        });
        setProductVariantPrices([]);
        getCombn(tags).forEach(item => {
            setProductVariantPrices(productVariantPrice => [...productVariantPrice, {
                title: item,
                price: 0,
                stock: 0
            }]);
        });
    };

    function getCombn(arr, pre) {
        pre = pre || '';
        if (!arr.length) {
            return pre;
        }
        let ans = arr[0].reduce((ans, value) => {
            return ans.concat(getCombn(arr.slice(1), pre + value + '/'));
        }, []);
        return ans;
    }

    const onDrop = (acceptedFiles) => {
        setFiles(acceptedFiles);
    };

    const saveProduct = async (event) => {
        event.preventDefault();

        const productData = {
            name: productName,
            sku: productSKU,
            description: description,
            variants: productVariants,
            prices: productVariantPrices,
        };

        // Create a form data object for file uploads
        const formData = new FormData();
        formData.append('product', JSON.stringify(productData));
        files.forEach((file, index) => {
            formData.append(`file_${index}`, file);
        });

        try {
            const response = await axios.post('/your-api-endpoint', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            // Handle the response as needed
            alert('Product saved successfully!');
        } catch (error) {
            console.error('There was an error saving the product!', error);
            alert('Error saving product. Please try again.');
        }
    };

    return (
        <div>
            <section>
                <div className="row">
                    <div className="col-md-6">
                        <div className="card shadow mb-4">
                            <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="">Product Name</label>
                                    <input
                                        type="text"
                                        placeholder="Product Name"
                                        className="form-control"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="">Product SKU</label>
                                    <input
                                        type="text"
                                        placeholder="Product SKU"
                                        className="form-control"
                                        value={productSKU}
                                        onChange={(e) => setProductSKU(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="">Description</label>
                                    <textarea
                                        cols="30"
                                        rows="4"
                                        className="form-control"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow mb-4">
                            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 className="m-0 font-weight-bold text-primary">Media</h6>
                            </div>
                            <div className="card-body border">
                                <Dropzone onDrop={onDrop}>
                                    {({ getRootProps, getInputProps }) => (
                                        <section>
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <p>Drag 'n' drop some files here, or click to select files</p>
                                            </div>
                                        </section>
                                    )}
                                </Dropzone>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card shadow mb-4">
                            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 className="m-0 font-weight-bold text-primary">Variants</h6>
                            </div>
                            <div className="card-body">
                                {
                                    productVariants.map((element, index) => (
                                        <div className="row" key={index}>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="">Option</label>
                                                    <select
                                                        className="form-control"
                                                        value={element.option}
                                                        onChange={(e) => {
                                                            let product_variants = [...productVariants];
                                                            product_variants[index].option = e.target.value;
                                                            setProductVariant(product_variants);
                                                        }}
                                                    >
                                                        {
                                                            JSON.parse(props.variants.replaceAll("'", '"')).map((variant, idx) => (
                                                                <option key={idx} value={variant.id}>{variant.title}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="form-group">
                                                    {productVariants.length > 1 &&
                                                        <label
                                                            className="float-right text-primary"
                                                            style={{ marginTop: "-30px" }}
                                                            onClick={() => removeProductVariant(index)}
                                                        >
                                                            remove
                                                        </label>
                                                    }
                                                    <section style={{ marginTop: "30px" }}>
                                                        <TagsInput
                                                            value={element.tags}
                                                            onChange={(value) => handleInputTagOnChange(value, index)}
                                                        />
                                                    </section>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="card-footer">
                                {productVariants.length !== 3 &&
                                    <button className="btn btn-primary" onClick={handleAddClick}>Add another option</button>
                                }
                            </div>

                            <div className="card-header text-uppercase">Preview</div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <td>Variant</td>
                                                <td>Price</td>
                                                <td>Stock</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                productVariantPrices.map((productVariantPrice, index) => (
                                                    <tr key={index}>
                                                        <td>{productVariantPrice.title}</td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                value={productVariantPrice.price}
                                                                onChange={(e) => {
                                                                    let prices = [...productVariantPrices];
                                                                    prices[index].price = e.target.value;
                                                                    setProductVariantPrices(prices);
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                value={productVariantPrice.stock}
                                                                onChange={(e) => {
                                                                    let prices = [...productVariantPrices];
                                                                    prices[index].stock = e.target.value;
                                                                    setProductVariantPrices(prices);
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="button" onClick={saveProduct} className="btn btn-lg btn-primary">Save</button>
                <button type="button" className="btn btn-secondary btn-lg">Cancel</button>
            </section>
        </div>
    );
};

export default CreateProduct;
