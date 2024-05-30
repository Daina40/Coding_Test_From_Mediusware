import React, {useState} from 'react';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import Dropzone from 'react-dropzone'
import axios from 'axios';

const CreateProduct = (props) => {

    const [productVariantPrices, setProductVariantPrices] = useState([])
    const [productVariants, setProductVariant] = useState([{option: 1, tags: []}])
    const [productName, setProductName] = useState("");
    const [productSKU, setProductSKU] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState([]);

    const handleAddClick = () => {
        let all_variants = JSON.parse(props.variants.replaceAll("'", '"')).map(el => el.id)
        let selected_variants = productVariants.map(el => el.option);
        let available_variants = all_variants.filter(entry1 => !selected_variants.some(entry2 => entry1 == entry2))
        setProductVariant([...productVariants, {option: available_variants[0], tags: []}])
    };

    const handleInputTagOnChange = (value, index) => {
        let product_variants = [...productVariants]
        product_variants[index].tags = value
        setProductVariant(product_variants)
        checkVariant()
    }

    const removeProductVariant = (index) => {
        let product_variants = [...productVariants]
        product_variants.splice(index, 1)
        setProductVariant(product_variants)
    }

    const checkVariant = () => {
        let tags = [];
        productVariants.filter((item) => {
            tags.push(item.tags)
        })
        setProductVariantPrices([])
        getCombn(tags).forEach(item => {
            setProductVariantPrices(productVariantPrice => [...productVariantPrice, {
                title: item,
                price: 0,
                stock: 0
            }])
        })
    }

    function getCombn(arr, pre) {
        pre = pre || '';
        if (!arr.length) {
            return pre;
        }
        let ans = arr[0].reduce(function (ans, value) {
            return ans.concat(getCombn(arr.slice(1), pre + value + '/'));
        }, []);
        return ans;
    }

    const onDrop = (acceptedFiles) => {
