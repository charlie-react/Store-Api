const Product = require("../models/product");

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      " <": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|<=|=)\b/g
    let filters = numericFilters.replace(regEx,(match)=>`-${operatorMap[match]}-`)
    console.log(filters)
    const options = ['price','rating']
    filters = filters.split(",").forEach((item)=>{
      const [field,operator,value]= item.split("-")
      console.log(field,operator,value)
      if(options.includes(field)){
        queryObject[field] = {[operator]:Number([value])}
      }
    })
    console.log(filters)
  }
  console.log(queryObject)
  let result = Product.find(queryObject);
  // sort
  if (sort) {
    console.log(sort);
    let sortList = sort.split(",").join(" ");
    console.log(sortList);
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }
  if (fields) {
    let fieldList = fields.split(",").join(" ");
    console.log(fieldList);
    result = result.select(fieldList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);
  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProductsStatic = async (req, res) => {
  // const searc = "a";
  const products = await Product.find({}).sort("-name price");
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
