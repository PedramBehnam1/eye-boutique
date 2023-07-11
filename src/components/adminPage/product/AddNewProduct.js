import React, { useEffect, useState } from "react";
import {
  Tooltip,
  Grid,
  MenuItem,
  Divider,
  Paper,
  Typography,
  Button,
  Box,
  Chip,
  Dialog,
  TextField,
  IconButton,
  CircularProgress,
  InputLabel,
  FormControl,
  Select,
  Switch,
  FormControlLabel,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardMedia,
  Autocomplete,
  Checkbox,
  Fade,
} from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import axiosConfig from "../../../axiosConfig";
import AdminLayout from "../../../layout/adminLayout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import { styled } from "@mui/material/styles";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Notification from "../../../layout/notification";
import CloseIcon from "@mui/icons-material/Close";
import "../../../asset/css/adminPage/addProduct.css";
import DifferenceIcon from "@mui/icons-material/Difference";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import StartIcon from "@mui/icons-material/Start";
import RuleIcon from "@mui/icons-material/Rule";



const AddNewProduct = () => {
  const location = useLocation();
  const [attributes, setAttributes] = useState([]);
  let history = useHistory();
  const [openAddTag, setOpenAddTag] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagValue, setTagValue] = useState([]);
  const [variantRow, setVariantRow] = useState(-1);
  const [variantCount, setVariantCount] = useState(1);
  const [additionalAttributes, setAdditionalAttributes] = useState([]);
  const [mainAttributeDescriptions, setMainAttributeDescriptions] = useState(
    []
  );
  const [variants, setVariants] = useState([
    {
      mainAttribute: [
        {
          attribute_id: 0,
          value: 0,
        },
      ],
      attributes: [],
      images: [],
      sku: "",
      price: "",
      stock: "",
      tags: [],
      has_description: false,
      description: "",
    },
  ]);
  const [parentId, setParentId] = useState("");
  const [parentFiles, setParentFiles] = useState([]);
  const [starId, setStarId] = useState();
  const [trigger, setTrigger] = useState(1);
  const [emptyAttribute, setEmptyAttribute] = useState(true);
  const [emptyVariant, setEmptyVariant] = useState(true);
  const [categoryId, setCategoryId] = useState("");
  const [imagePreview, setImagePreview] = useState([]);
  const [starImage, setStarImage] = useState("");
  const [_trigger, set_Trigger] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const Input = styled("input")({
    display: "none",
  });
  const [base, setBase] = useState();
  const [selectedRow, setSelectedRow] = useState("");
  const [_selectedRow, set_SelectedRow] = useState("");
  const [_selectedRow_, set_SelectedRow_] = useState("");
  const [_trigger_, set_Trigger_] = useState("");
  const [_tagValue, set_TagValue] = useState([]);
  const [_tagValue_, set_TagValue_] = useState([]);
  const [openAddTagBasic, setOpenAddTagBsic] = useState(false);
  const [tagValueBasic, setTagValueBasic] = useState([]);
  const [tagValueListBasic, setTagValueListBasic] = useState([]);
  const [imagePreviewBasic, setImagePreviewBasic] = useState([]);
  const [productGroupImage, setProductGroupImage] = useState([]);
  const [imageFileBasic, setImageFileBasic] = useState(null);
  const [numberBasic, setNumberBasic] = useState(1);
  const [_numberBasic, set_NumberBasic] = useState("");
  const [name, setProductGroupName] = useState("");
  const [nameArabic, setProductGroupArabicName] = useState("");
  const [description, setProductGroupDescription] = useState("");
  const [openDeleteVariant, setOpenDeleteVariant] = useState(false);
  const [_selectedRow__, set_SelectedRow__] = useState("");
  const [emptyVariantRow, setEmptyVariantRow] = useState([]);
  const [isTrue, setIsTrue] = useState(true);
  const [_trigger__, set_Trigger__] = useState("");
  const [_trigger___, set_Trigger___] = useState("");
  const [openVariant, setOpenVariant] = useState(false);
  const [openChooseMain, setOpenChooseMain] = useState(false);
  const [openAddValue, setOpenAddValue] = useState(false);
  const [expand, setExpand] = useState([false]);
  const [imageNumber, setImageNumber] = useState(0);
  const [videoNumber, setVideoNumber] = useState(0);
  const [showVariant, setShowVariant] = React.useState(false);
  const [selectedProductsMainAttribute, setSelectedProductsMainAttribute] =
    useState([]);
  const [selectedMainAttributes, setSelectedMainAttributes] = useState([]);
  const [selectedMainAttributeText, setSelectedMainAttributeText] = useState(
    []
  );
  
  const [dropdownSelectedValue, setDropdownSelectedValue] = useState([]);
  const [disabledSave, setDisabledSave] = useState(false);
  const [textAttributeValuesList, setTextAttributeValuesList] = useState([]);
  const [textAttributeValuesTrigger, setTextAttributeTrigger] = useState(0);
  const [disabledAddAttribute, setDisabledAddAttribute] = useState(false);
  const [itemcodeList, setItemcodeList] = useState([]);
  const [itemcodeChecker, setItemcodeChecker] = useState(false);
  const [validatedItemCode, setValidatedItemCode] = useState(false);
  const [user, setUser] = useState("11");
  const [role, setRole] = useState("");
  const [validatorState, setValidatorState] = useState(0);
  const [notificationObj, setNotificationObj] = useState({
    open:  false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    getUserInfo();
  }, []);
  const getUserInfo = async () => {
    await axiosConfig
      .get("/users/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(async (res) => {
        let user = res.data.user;
        setUser(user);
        await axiosConfig
          .get("/users/get_roles", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            let _role = "";
            res.data.roles_list.map((role) => {
              if (role.id == user.role) {
                setRole(role.title);
                _role = role.title;
              }
            });
            if (_role != "admin" && _role != "super admin") {
              history.push("/");
            }
          });
      })
      .catch((err) =>{
        if(err.response.data.error.status === 401){
          axiosConfig
            .post("/users/refresh_token", {
              refresh_token: localStorage.getItem("refreshToken"),
            })
            .then((res) => {
              localStorage.setItem("token", res.data.accessToken);
              localStorage.setItem("refreshToken", res.data.refreshToken);
              getUserInfo();
            })
        }else{
          
          setNotificationObj({
            open: true,
            type: "failed",
            message: `Get user info dosen't work!`,
          });
          setTimeout(
            () =>
              setNotificationObj({
                open: false,
                type: "failed",
                message: "",
              }),
            6000
          );
        } 
      });
  };

  const accordionProps = {
    sx: {
      pointerEvents: "none",
    },
    expandIcon: (
      <ExpandMoreIcon
        sx={{
          pointerEvents: "auto",
        }}
      />
    ),
  };
  
  const deleteSelectedVariant = (row, mainAttr) => {
    set_SelectedRow_(row);
    setOpenDeleteVariant(true);
  };
  const addVariantDescription = (row) => {
    variants[row].has_description = true;
    setTrigger((prev) => !prev);
  };

  const deleteVariantDescription = (row) => {
    variants[row].has_description = false;
    variants[row].description = "";
    setTrigger((prev) => !prev);
  };
  const changeVariantDescription = (row, value) => {
    variants[row].description = value;
  };

  const addMainAttributeDescription = (mainAttr, index) => {
    let flagAttribute = false;
    mainAttributeDescriptions.map((attribute, index) => {
      if (Object.values(attribute).includes(mainAttr)) {
        flagAttribute = true;
      }
    });
    if (flagAttribute) {
      
      
      setNotificationObj({
        open: true,
        type: "failed",
        message: `you can not add multiple description for main attributes!!`,
      });
      setTimeout(
        () =>
          setNotificationObj({
            open: false,
            type: "failed",
            message: "",
          }),
        6000
      );
    } else {
      const mainAttributeDescriptionsObj = [...mainAttributeDescriptions];
      mainAttributeDescriptionsObj.push({
        attribute_id: mainAttr,
        description: "",
      });
      setMainAttributeDescriptions(mainAttributeDescriptionsObj);
    }
  };

  const deleteMainAttributeDescription = (mainAttr, index) => {
    let flagAttribute = "";
    mainAttributeDescriptions.map((attribute, index) => {
      if (Object.values(attribute).includes(mainAttr)) {
        flagAttribute = index;
      }
    });
    const _mainAttributeDescriptions = [...mainAttributeDescriptions];
    _mainAttributeDescriptions.splice(flagAttribute, 1);
    setMainAttributeDescriptions(_mainAttributeDescriptions);
  };

  const changeMainAttributeDescription = (mainAttr, value) => {
    let flagAttribute = "";
    mainAttributeDescriptions.map((attribute, index) => {
      if (Object.values(attribute).includes(mainAttr)) {
        flagAttribute = index;
      }
    });
    const _mainAttributeDescriptions = [...mainAttributeDescriptions];
    _mainAttributeDescriptions.splice(flagAttribute, 1, {
      attribute_id: mainAttr,
      description: value,
    });
    setMainAttributeDescriptions(_mainAttributeDescriptions);
  };

  const mainAttribueDescriptionLoader = (mainAttr, index) => {
    let flagAttribute = false;
    mainAttributeDescriptions.map((attribute, index) => {
      if (Object.values(attribute).includes(mainAttr)) {
        flagAttribute = true;
      }
    });
    if (flagAttribute) {
      return (
        <Grid item xs={12} p={1} sx={{ position: "relative" }}>
          <TextField
            id="outlined-attribute"
            label="Description"
            multiline
            rows={4}
            required
            fullWidth
            color="P"
            onChange={(e) =>
              changeMainAttributeDescription(mainAttr, e.target.value)
            }
          />
          <Grid
            sx={{ position: "absolute", right: 10, bottom: 15, zIndex: 100 }}
          >
            <Tooltip title="delete description">
              <Button
                sx={{ color: "P.main" }}
                size="small"
                onClick={() => deleteMainAttributeDescription(mainAttr, index)}
              >
                <DeleteIcon />
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      );
    }
  };
  const ValidateVariants = () => {
    const variantsItemCodesList = [];
    variants.map((variant) => {
      variantsItemCodesList.push(variant.sku);
    });
    if (variantsItemCodesList.length == 0) {
      setValidatorState(0);
      setNotificationObj({
        open: true,
        type: "failed",
        message: `No item codes were found to validate!`,
      });
      setTimeout(
        () =>
          setNotificationObj({
            open: false,
            type: "failed",
            message: "",
          }),
        6000
      );
    } else {
      if (variantsItemCodesList.includes("")) {
        setNotificationObj({
          open: true,
          type: "failed",
          message: `One or more item code(s) are empty!`,
        });
        setTimeout(
          () =>
            setNotificationObj({
              open: false,
              type: "failed",
              message: "",
            }),
          6000
        );
        setValidatorState(1);
        setValidatedItemCode(false);
      } else {
        const _variantsItemCodesList = new Set(variantsItemCodesList);

        if (_variantsItemCodesList.size !== variantsItemCodesList.length) {
          setNotificationObj({
            open: true,
            type: "failed",
            message: `Same item code(s) are being used in this page!`,
          });
          setTimeout(
            () =>
              setNotificationObj({
                open: false,
                type: "failed",
                message: "",
              }),
            6000
          );
          setValidatorState(1);
          setValidatedItemCode(false);
        } else {
          variantsItemCodesList.map((itemCode) => {
            if (itemcodeList.find((element) => element == itemCode)) {
              setValidatorState(1);
              setValidatedItemCode(false);

              setNotificationObj({
                open: true,
                type: "failed",
                message: `Found duplicate item code in database!`,
              });
              setTimeout(
                () =>
                  setNotificationObj({
                    open: false,
                    type: "failed",
                    message: "",
                  }),
                6000
              );
              setValidatorState(1);
              setValidatedItemCode(false);
            } else {
              setValidatorState(2);
              setValidatedItemCode(true);
              setNotificationObj({
                open: true,
                type: "success",
                message: `Item code(s) validated with database!`,
              });
              setTimeout(
                () =>
                  setNotificationObj({
                    open: false,
                    type: "success",
                    message: "",
                  }),
                6000
              );
            }
          });
        }
      }
    }
  };

  const duplicateVariant = (mainAttr, index) => {
    const _variants = [...variants];
    _variants.push({
      mainAttribute: [
        {
          attribute_id: parentId,
          value: mainAttr,
        },
      ],
      attributes: [],
      images: [],
      sku: "",
      price: "",
      stock: "",
      tags: [],
      has_description: false,
      description: "",
      variantGroup: index,
    });
    setVariants(_variants);
    setOpenVariant(false);
    setItemcodeChecker(true);
  };

  const variantsCreator = (mainAttr, index) => {
    if (dropdownSelectedValue === [] || dropdownSelectedValue.length === 0) {
      setNotificationObj({
        open: true,
        type: "failed",
        message: `You must choose one attribute value to process!`,
      });
      setTimeout(
        () =>
          setNotificationObj({
            open: false,
            type: "failed",
            message: "",
          }),
        6000
      );
    } else {
      let newVariantCount = variantRow + 1;
      setVariantRow(newVariantCount);

      const _selectedMainAttributes = [...selectedMainAttributes];
      _selectedMainAttributes.push(dropdownSelectedValue);
      setSelectedMainAttributes(_selectedMainAttributes);
      const _variants = [...variants];
      _variants.push({
        mainAttribute: [
          {
            attribute_id: selectedProductsMainAttribute.id,
            value: dropdownSelectedValue,
          },
        ],
        attributes: [],
        images: [],
        sku: "",
        price: "",
        stock: "",
        tags: [],
        has_description: false,
        description: "",
        variantGroup: newVariantCount,
      });
      setVariants(_variants);
      setOpenChooseMain(!openChooseMain);
      setDropdownSelectedValue([]);
    }
  };

  const handleShowVariant = () => {
    setShowVariant((prev) => !prev);
  };


  useEffect(() => {
    refreshList();
    if (selectedProductsMainAttribute) {
      axiosConfig
        .get(
          `/admin/category/get_attribute_values_list/${selectedProductsMainAttribute.id}`
        )
        .then((res) => {
          setTextAttributeValuesList(res.data.attribute_values_list);
        })
        .catch((err) =>{
          
          setNotificationObj({
            open: true,
            type: "failed",
            message: `can not get attribute values list! `,
          });
          setTimeout(
            () =>
              setNotificationObj({
                open: false,
                type: "failed",
                message: "",
              }),
            6000
          );
        });
    }
  }, [
    categoryId,
    selectedMainAttributes,
    mainAttributeDescriptions,
    dropdownSelectedValue,
    trigger,
  ]);

  useEffect(async () => {

    variants.map((variant, index) => {
      if (
        variant.mainAttribute[0].attribute_id === 0 ||
        variant.mainAttribute[0].value === 0
      ) {
        variants.shift();
      }
    });

    let flagAttribute = [];
    variants.map((variant, index) => {
      flagAttribute.push(variant.mainAttribute[0].value);
    });
    let uniqueArray = flagAttribute.filter(function (item, pos) {
      return flagAttribute.indexOf(item) == pos;
    });
    setSelectedMainAttributes(uniqueArray);

    axiosConfig.get(`/admin/product/add/${categoryId}`).then((res) => {
      if (
        Object.values(additionalAttributes).length >=
        res.data.data.attributes
          .filter((a) => !a.is_variant)
          .filter((b) => b.type !== 4).length -
          3
      ) {
        const newAddition = Object.values(additionalAttributes);
        for (let i = 0; i < newAddition.length; i++) {
          if (
            newAddition[i].attribute_id != 235 &&
            newAddition[i].attribute_id != 236
          ) {
            if (newAddition[i].value !== "") {
              setEmptyAttribute(false);
            } else {
              setEmptyAttribute(true);
              break;
            }
          }
        }
      }

      for (let i = 0; i < variants.length; i++) {
        if (
          variants[i].attributes.length ==
          res.data.data.attributes.filter((a) => a.is_variant).length
        ) {
          if (
            variants[i].price !== "" &&
            variants[i].sku !== "" &&
            variants[i].stock !== ""
          ) {
            setEmptyVariant(false);
          } else {
            setEmptyVariant(true);
            break;
          }
        } else {
          setEmptyVariant(true);
        }
      }
    });
  }, [additionalAttributes, _trigger, variants, parentFiles]);

  useEffect(async () => {
    emptyVariantRow[_selectedRow__] = isTrue;
  }, [_trigger___]);

  const refreshList = () => {
    if (categoryId === "") {
      setCategoryId(location.state.categoryId);
    }
    categoryId !== "" &&
      axiosConfig.get(`/admin/product/add/${categoryId}`).then((res) => {
        let result = [];
        let _result = {};
        let _result_ = [];
        let type = [];
        let _type = [];
        let _type__ = [];
        let _type___ = [];
        res.data.data.attributes.map((attribute) => {
          if (attribute.is_parent && attribute.is_variant) {
            _result = attribute;
            setSelectedProductsMainAttribute(_result);
          } else {
            result.push(attribute);
          }
        });

        if (Object.values(_result).length != 0) {
          _result_.push(_result);
        }
        result.map((attribute) => {
          _result_.push(attribute);
        });
        _result_.map((attribute) => {
          if (attribute.type == 1) {
            type.push(attribute);
          }
        });
        _result_.map((attribute) => {
          if (attribute.type == 2) {
            _type.push(attribute);
          }
        });
        _result_.map((attribute) => {
          if (attribute.type == 3) {
            _type__.push(attribute);
          }
        });
        _result_.map((attribute) => {
          if (attribute.type == 4) {
            _type___.push(attribute);
          }
        });

        _result_ = [];
        type.map((attribute) => {
          _result_.push(attribute);
        });
        _type.map((attribute) => {
          _result_.push(attribute);
        });
        _type__.map((attribute) => {
          _result_.push(attribute);
        });
        _type___.map((attribute) => {
          _result_.push(attribute);
        });

        setAttributes(_result_);
        setTags(res.data.data.tags);
        setParentId(
          res.data.data.attributes.filter((a) => a.is_parent)[0]["id"]
        );
        
      });

    axiosConfig.get(`/admin/product/get_itemcode_list`).then((result) => {
      setItemcodeList(result.data.itemcode_list);
    });
  };

  function csvImporter(file, mainAttr, index) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const rows = reader.result.split(/\r?\n/);
      let csv_titles = [];
      let importedVariants = [];
      rows.map((row) => {
        importedVariants = [...importedVariants, row.split(",")];
      });
      csv_titles = importedVariants[0];
      const itemCodeIndex = csv_titles.indexOf("ItemCode");
      const quantityIndex = csv_titles.indexOf("Quantity");
      const priceIndex = csv_titles.indexOf("Price");
      const _importedVariants = importedVariants.slice(1, importedVariants.length - 1);

      let variantsArray = [];
      rows.map((row) => {
        variantsArray = [...variantsArray, row.split(",")];
      });

      const variantValidatorList = variantsArray.slice(
        1,
        variantsArray.length - 1
      );
      variantValidatorList.map((variantItem) => {
        variantItem.splice(itemCodeIndex, priceIndex);
      });

      const importedSideAttributes = [];
      attributes.map((attribute) => {
        if (attribute.is_variant && !attribute.is_parent) {
          importedSideAttributes.push({ [attribute.title]: "" });
        }
      });

      var result = Object.values(
        variantValidatorList.reduce((c, v) => {
          let _index = "";
          for (
            let index = 0;
            index < importedSideAttributes.length;
            index++
          ) {
            _index += v[index] + "-";
          }
          c[_index] = c[_index] || [];
          c[_index].push(v);
          return c;
        }, {})
      ).reduce((c, v) => (v.length > 1 ? c.concat(v) : c), []);

      if (result.length == 0) {
        const variantToImport = [...variants];
        const itemCodeList = [];
        _importedVariants.map((_variant) => {
          itemCodeList.push(_variant[itemCodeIndex]);
        });
        const newIitemCodeList = Array.from(new Set(itemCodeList));

        if (itemCodeList.length === newIitemCodeList.length) {
          _importedVariants.map((_variant) => {
            let sideAttributes = [];
            let tempSideAttributeId = "";
            let tempSideAttributeValueId = "";
            let skuValue = "";
            let priceValue = "";
            let quantityValue = "";

            csv_titles.map((side_attribute, index) => {
              if (index < importedSideAttributes.length) {
                var attribute = attributes.find(
                  (item) => item.title === side_attribute
                );
                tempSideAttributeId = attribute.id;
                let tempSideAttributeValue = attribute.values.find(
                  (item) => item.value === _variant[index]
                );
                tempSideAttributeValueId =
                tempSideAttributeValue != undefined
                    ? tempSideAttributeValue.id
                    : "";

                    sideAttributes.push({
                  attribute_id: tempSideAttributeId,
                  value: tempSideAttributeValueId,
                });
              }
            });

            skuValue = _variant[itemCodeIndex];
            priceValue = _variant[quantityIndex];
            quantityValue = _variant[priceIndex];

            variantToImport.push({
              mainAttribute: [
                {
                  attribute_id: parentId,
                  value: mainAttr,
                },
              ],
              attributes: sideAttributes,
              images: [],
              sku: skuValue,
              price: priceValue,
              stock: quantityValue,
              tags: [],
              has_description: false,
              description: "",
              variantGroup: index,
            });
            setVariants(variantToImport);
          });
          setNotificationObj({
            open: true,
            type: "success",
            message: `Data imported from file!`,
          });
          setTimeout(
            () =>
              setNotificationObj({
                open: false,
                type: "success",
                message: "",
              }),
            6000
          );
        } else {
          setNotificationObj({
            open: true,
            type: "failed",
            message: `Variants have duplicate values in side attributes!`,
          });
          setTimeout(
            () =>
              setNotificationObj({
                open: false,
                type: "failed",
                message: "",
              }),
            6000
          );
        }
      } else {
        setNotificationObj({
          open: true,
          type: "failed",
          message: `Detected duplicate values in selected file!`,
        });
        setTimeout(
          () =>
            setNotificationObj({
              open: false,
              type: "failed",
              message: "",
            }),
          6000
        );
      }
    };
    reader.readAsText(file);
  }

  const readCSV = (mainAttr, index) => {
    const selectedFile = document.getElementById("input").files[0];
    if (selectedFile == undefined) {
      setNotificationObj({
        open: true,
        type: "failed",
        message: `Choose a csv file first!`,
      });
      setTimeout(
        () =>
          setNotificationObj({
            open: false,
            type: "failed",
            message: "",
          }),
        6000
      );
    } else {
      csvImporter(selectedFile, mainAttr, index);
    }
  };

  
  function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;

    var CSV = "";
    //Set Report title in first row or line
    // CSV += ReportTitle + "\r\n\n";

    //This condition will generate the Label/Header
    if (ShowLabel) {
      var row = "";

      for (let index = 0; index < arrData.length; index++) {
        for (var data in arrData[index]) {
          //Now convert each value to string and comma-seprated
          row += data + ",";
        }
      }

      row = row.slice(0, -1);

      //append Label row with line break
      CSV += row + "\r\n";
    }

    if (CSV == "") {
      
      setNotificationObj({
        open: true,
        type: "failed",
        message: `Invalid data! `,
      });
      setTimeout(
        () =>
          setNotificationObj({
            open: false,
            type: "failed",
            message: "",
          }),
        6000
      );
      return;
    }

    //Generate a file name
    var fileName = "ib_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, "_");

    //Initialize file format you want csv or xls
    var uri = "data:text/csv;charset=utf-8," + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const generateCSV = () => {
    const titleOfAttributes = [];
    attributes.map((attribute) => {
      if (attribute.is_variant && !attribute.is_parent) {
        titleOfAttributes.push({ [attribute.title]: "" });
      }
    });

    const titles = [
      ...titleOfAttributes,
      { ItemCode: "" },
      {
        Quantity: "",
      },
      {
        Price: "",
      },
    ];

    JSONToCSVConvertor(titles, "EyeBoutique Variant Template", true);
  };
  const addProduct = () => {
    setDisabledSave(true);

    const productGroupImagesIDs = [];
    if (productGroupImage) {
      for (let groupImage of productGroupImage) {
        productGroupImagesIDs.push({
          file_id: groupImage.id,
          is_thumbnail: true,
        });
      }
    } else {
      productGroupImagesIDs = [];
    }

    variants.map((variant, index) => {
      if (variant.mainAttribute[0].attribute_id === 0) {
        variants.shift();
      }
    });

    selectedMainAttributes.map((main, index) => {
      variants.map((variant) => {
        if (variant.mainAttribute[0].value == main) {
          variant.variantGroup = index;
        }
      });
    });

    if (imagePreview.length !== 0) {
      imagePreview.map((image, index) => {
        variants.map((variant) => {
          if (variant.variantGroup == index) {
            variant.images = image;
          }
        });
      });
    }
    variants.map((variant, index) => {
      if (tagValue[index]) {
        for (let tags of tagValue[index]) {
          if (!variant.tags.includes(tags)) {
            variant.tags.push(tags);
          }
        }
      } else {
        variant.tags = [];
      }
    });

    attributes
      .filter((a) => !a.is_variant)
      .forEach((attribute) => {
        if (!additionalAttributes[attribute.id]) {
          if ( attribute.type === 4) {
            additionalAttributes[attribute.id] = {
              attribute_id: attribute.id,
              value: false,
            }
          } else{
            additionalAttributes[attribute.id] = {
              attribute_id: attribute.id,
              value: "",
            }
          }
        }
        
      });
    const productObj = {
      category_id: categoryId,
      name: name,
      arabic_name: nameArabic,
      description: description,
      additional_attributes: Object.values(additionalAttributes),
      variants: variants,
      group_images: productGroupImagesIDs,
      tags: tagValueListBasic,
      mainAttributeDescriptions: mainAttributeDescriptions,
    };

    axiosConfig
      .post("/admin/product/add_product", productObj)
      .then((res) => {
        setTimeout(() => {
          history.push("/admin/product");
        }, 1000);
      })
      .catch((err) => {
        setNotificationObj({
          open: true,
          type: "failed",
          message: `You can not add product! `,
        });
        setTimeout(
          () =>
            setNotificationObj({
              open: false,
              type: "failed",
              message: "",
            }),
          6000
        );
      });
  };

  const variantDetailLoader = (mainAttr, index) => {
    let counter = [];
    if (mainAttr) {
      return (
        <Grid
          container
          xs={12}
          display="flex"
          flexWrap="wrap"
          sx={{ display: "flex", width: "100%" }}
        >
          <Grid item>
            {attributes.map((attribute) => {
              if (attribute.is_variant && attribute.is_parent) {
                var attributeValue = attribute.values.filter(
                  (a) => a.id === mainAttr
                );
                return (
                  <Grid
                    item
                    xs={12}
                    className="flex"
                    display="flex"
                    flexWrap="wrap"
                  >
                    <Typography ml={1} color={"P.main"}>
                      {attribute.title + ": "}
                    </Typography>
                    <Typography ml={1}>{attributeValue[0].value}</Typography>
                  </Grid>
                );
              }
            })}
          </Grid>
          {variants.map((variant) => {
            if (variant.mainAttribute[0].value == mainAttr) {
              counter.push(variant);
            }
          })}
          <Grid item>
            <Box
              sx={{
                width: 25,
                height: 25,
                backgroundColor: "P.main",
                borderRadius: "50%",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                verticalAlign: "center",
                marginLeft: 3,
              }}
            >
              <Typography align="center" color="white" variant="menuitem">
                {counter.length}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      );
    }
  };
  
  const sideAttributesLoader = (variant, row) => {
    return (
      <Grid item xs={12} className="flex" display="flex" flexWrap="wrap">
        {attributes.map((attribute) => {
          if (attribute.is_variant && !attribute.is_parent) {
            if (attribute.type === 1) {
              return (
                <Grid item md={4} xl={3} p={1}>
                  <FormControl fullWidth>
                    <InputLabel id={attribute.title} color="P" required>
                      {attribute.title.charAt(0).toUpperCase() +
                        attribute.title.slice(1)}
                    </InputLabel>
                    <Select
                      IconComponent={KeyboardArrowDownIcon}
                      labelId={attribute.title}
                      id="demo-simple-select-required"
                      color="P"
                      value={
                        variants[row].attributes.filter(
                          (a) => a.attribute_id === attribute.id
                        )[0]
                          ? variants[row].attributes.filter(
                              (a) => a.attribute_id === attribute.id
                            )[0]["value"]
                          : ""
                      }
                      label={attribute.title}
                      onChange={(e) => {
                        handleChangeVariantAttribute(
                          row,
                          attribute.id,
                          e.target.value
                        );
                      }}
                    >
                      {attribute.values.map((val) => {
                        return <MenuItem value={val.id}>{val.value}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                </Grid>
              );
            }
            if (attribute.type === 2) {
              return (
                <Grid item md={4} xl={3} p={1}>
                  <TextField
                    id="outlined-attribute"
                    color="P"
                    label={attribute.title ? attribute.title : "No title"}
                    variant="outlined"
                    required
                    fullWidth
                    onChange={(e) => setProductGroupName(e.target.value)}
                  ></TextField>
                </Grid>
              );
            }
            if (attribute.type === 4) {
              return (
                <Grid item xs={2} p={1} display="flex" alignItems="center">
                  <FormControlLabel
                    control={<Switch color="P" name="gilad" />}
                    label={attribute.title}
                    labelId={attribute.title}
                    onChange={(e) =>
                      handleChangeVariantAttribute(
                        row,
                        attribute.id,
                        e.target.checked
                      )
                    }
                  />
                </Grid>
              );
            }
          }
        })}
      </Grid>
    );
  };
  const customAttributesLoader = (variant, row) => {
    return (
      <Grid item xs={12} className="flex" display="flex" flexWrap="wrap">
        <Grid item md={4} xl={3} p={1}>
          <TextField
            label="Item Code"
            id="outlined-start-adornment"
            fullWidth
            error={variants[row].sku == "" ? true : false}
            color="P"
            required
            value={variants[row].sku}
            onChange={(e) => {
              setValidatedItemCode(false);

              if (
                itemcodeList.find(
                  (list) => list === e.target.value.toUpperCase()
                )
              ) {
                setNotificationObj({
                  open: true,
                  type: "failed",
                  message: `Found duplicate item code in database!`,
                });
                setTimeout(
                  () =>
                    setNotificationObj({
                      open: false,
                      type: "failed",
                      message: "",
                    }),
                  6000
                );
                setItemcodeChecker(true);
              } else {
                setItemcodeChecker(false);
              }
              if (/^[\d\w]*$/.test(e.target.value.toUpperCase())) {
                variants[row] = {
                  ...variants[row],
                  attributes: variants[row].attributes,
                  images: variants[row].images,
                  sku: e.target.value.toUpperCase(),
                  price: variants[row].price,
                  stock: variants[row].stock,
                };
                set_Trigger(_trigger + 1);
                set_Trigger__(_trigger__ + 1);
                set_SelectedRow__(row);
              }
            }}
          />
        </Grid>
        <Grid item md={4} xl={3} p={1}>
          <TextField
            label="Stock"
            id="outlined-start-adornment"
            fullWidth
            color="P"
            required
            value={variants[row].stock}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value)) {
                variants[row] = {
                  ...variants[row],
                  attributes: variants[row].attributes,
                  images: variants[row].images,
                  sku: variants[row].sku,
                  price: variants[row].price,
                  stock: e.target.value,
                };
                set_Trigger(_trigger + 1);
                set_Trigger__(_trigger__ + 1);
                set_SelectedRow__(row);
              }
            }}
          />
        </Grid>
        <Grid item md={4} xl={3} p={1}>
          <TextField
            label="Price"
            id="outlined-start-adornment"
            fullWidth
            color="P"
            required
            value={variants[row].price}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end"> KWD</InputAdornment>
              ),
            }}
            onChange={(e) => {
              if (variants[row].price == "" && e.target.value == ".") {
                variants[row] = {
                  ...variants[row],
                  attributes: variants[row].attributes,
                  images: variants[row].images,
                  sku: variants[row].sku,
                  price: 0 + e.target.value,
                  stock: variants[row].stock,
                };
                set_Trigger(_trigger + 1);
                set_Trigger__(_trigger__ + 1);
                set_SelectedRow__(row);
              } else if (
                /^\d*(\.\d{0,2})?$/.test(e.target.value) &&
                e.target.value != "e"
              ) {
                variants[row] = {
                  ...variants[row],
                  attributes: variants[row].attributes,
                  images: variants[row].images,
                  sku: variants[row].sku,
                  price: e.target.value,
                  stock: variants[row].stock,
                };
                set_Trigger(_trigger + 1);
                set_Trigger__(_trigger__ + 1);
                set_SelectedRow__(row);
              }
            }}
          />
        </Grid>
      </Grid>
    );
  };

  const bread = [
    {
      title: "Products",
      href: "/admin/product",
    },
    {
      title: "Add Product",
      href: "/admin/product",
    },
  ];

  const commonStyles = {
    bgcolor: "background.paper",
    borderColor: "text.primary",
    m: 0,
    border: 1,
    width: "2rem",
    height: "2rem",
  };

  const handleClickOpenDialogTags = (row) => {
    if (row === "") {
      setOpenAddTagBsic(true);
    } else {
      setOpenAddTag(true);
      set_SelectedRow(row);
    }
  };

  const handleCloseDialog = (row) => {
    if (row == "Basic") {
      setOpenAddTagBsic(false);
      setTagValueBasic([]);
    } else if ("Variants") {
      setOpenAddTag(false);
      set_TagValue_([]);
      set_TagValue([]);
    }
  };

  const chooseMainAttributeDialog = (row) => {
    setOpenVariant(!openVariant);
    setOpenChooseMain(!openChooseMain);
  };
  const chooseMainAttributeCloseDialog = (row) => {
    setOpenChooseMain(!openChooseMain);
  };
  const enterAttributeOpenDialog = (row) => {
    setOpenAddValue(true);
  };
  const enterAttributeCloseDialog = (row) => {
    setOpenAddValue(!openChooseMain);
    setSelectedMainAttributeText("");
  };
  
  const mainAttributeComponentLoader = () => {
    if (selectedProductsMainAttribute.type == 2) {
      if (textAttributeValuesTrigger == 0) {
        axiosConfig
          .get(
            `/admin/category/get_attribute_values_list/${selectedProductsMainAttribute.id}`
          )
          .then((res) => {
            setTextAttributeValuesList(res.data.attribute_values_list);
          })
          .catch((err) => {
            setNotificationObj({
              open: true,
              type: "failed",
              message: `Get attribute values list have problem! `,
            });
            setTimeout(
              () =>
                setNotificationObj({
                  open: false,
                  type: "failed",
                  message: "",
                }),
              6000
            );
          });
        setTextAttributeTrigger(1);
      }
      if (textAttributeValuesList && textAttributeValuesList.length !== 0) {
        return (
          <Grid md={12} p={1}>
            <FormControl fullWidth>
              <InputLabel id={selectedProductsMainAttribute.title} color="P">
                {selectedProductsMainAttribute.title}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id={selectedProductsMainAttribute.title}
                color="P"
                label={selectedProductsMainAttribute.title}
                onChange={(e) => {
                  setDropdownSelectedValue(e.target.value);
                }}
              >
                {textAttributeValuesList.map((val) => {
                  return <MenuItem value={val.id}>{val.value}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Grid>
        );
      }
    } else {
      const values = selectedProductsMainAttribute.values;
      if (selectedProductsMainAttribute && typeof values === "object") {
        return (
          <Grid md={12} p={1}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                {selectedProductsMainAttribute.title}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Age"
                onChange={(e) => {
                  setDropdownSelectedValue(e.target.value);
                }}
              >
                {selectedMainAttributes.length === 0
                  ? values.map((val) => {
                      return <MenuItem value={val.id}>{val.value}</MenuItem>;
                    })
                  : values.map((val) => {
                      return selectedMainAttributes.map((mainAttrID) => {
                        if (val.id === mainAttrID) {
                          return (
                            <MenuItem value={val.id} disabled>
                              {val.value}
                            </MenuItem>
                          );
                        }
                        return <MenuItem value={val.id}>{val.value}</MenuItem>;
                      });
                    })}
              </Select>
            </FormControl>
          </Grid>
        );
      }
    }
  };
  const handleClickOpenDialogVariants = (row) => {
    setOpenVariant(!openVariant);
  };
  const updateTagList = (row) => {
    if (row == "Basic") {
      tagValueBasic.forEach((element) => {
        tagValueListBasic.push(element.id);
      });
      setOpenAddTagBsic(false);
    } else if ("Variants") {
      setTagValue(_tagValue_);
      set_TagValue([]);
      setOpenAddTag(false);
    }
  };

  const clickRemoveVariant = (row) => {
    const modifiedAttributes = variants.filter((elem, index) => index != row);
    const filteredEpand = expand.filter((elem, index) => index != row);
    const filteredPicture = imagePreview.filter((elem, index) => index != row);

    let newVariantCount = variantCount - 1;
    setImagePreview(filteredPicture);
    setVariantCount(newVariantCount);
    setVariants(modifiedAttributes);
    setExpand(filteredEpand);
    setOpenDeleteVariant(false);
  };

  const handleChangeAttribute = (id, newValue) => {
    additionalAttributes[id] = {
      attribute_id: id,
      value: newValue,
    };
    set_Trigger(_trigger + 1);
  };
  const handleSelectTextAttribute = () => {
    if (dropdownSelectedValue.length !== 0 && dropdownSelectedValue !== []) {
      variantsCreator();
    }
  };

  const handleSaveTextAttribute = () => {
    let existFlag = false;
    let list = [];
    textAttributeValuesList.map((item) => {
      list.push(item.value);
    });
    let similarItems = list.filter(
      (item) => item.indexOf(selectedMainAttributeText) > -1
    );
    if (similarItems.length > 0) {
      
      setNotificationObj({
        open: true,
        type: "failed",
        message: `This is a list of similar items\n"${similarItems}! `,
      });
      setTimeout(
        () =>
          setNotificationObj({
            open: false,
            type: "failed",
            message: "",
          }),
        6000
      );
    }
    if (list.includes(selectedMainAttributeText)) {
      existFlag = true;
    }
    if (existFlag == true) {
      setNotificationObj({
        open: true,
        type: "failed",
        message: `attribute already exist!`,
      });
      setTimeout(
        () =>
          setNotificationObj({
            open: false,
            type: "failed",
            message: "",
          }),
        6000
      );
    } else {
      setDisabledAddAttribute(true);
      setDropdownSelectedValue([]);
      const textAttributeObj = {
        attribute_id: selectedProductsMainAttribute.id,
        attribute_value: selectedMainAttributeText,
      };
      axiosConfig
        .post("/admin/category/add_text_attribute_value", textAttributeObj)
        .then((res) => {
          setTrigger(trigger + 1);
          setOpenAddValue(false);
          setDisabledAddAttribute(false);
        })
        .catch((err) => {
          setNotificationObj({
            open: true,
            type: "failed",
            message: `You can not add text!`,
          });
          setTimeout(
            () =>
              setNotificationObj({
                open: false,
                type: "failed",
                message: "",
              }),
            6000
          );
        });
    }
  };

  const handleChangeVariantAttribute = (row, id, newValue) => {
    const _variants = variants;
    
    if (variants[row].attributes.find((a) => a.attribute_id === id)) {
      const filterAttribute = variants[row].attributes.filter(
        (a) => a.attribute_id !== id
      );

      _variants[row] = {
        ..._variants[row],
        attributes: [
          ...Object.values(filterAttribute),
          {
            attribute_id: id,
            value: newValue,
          },
        ],
      };
    } else {
      _variants[row] = {
        ..._variants[row],
        attributes: [
          ..._variants[row].attributes,
          (_variants[row].attributes[id] = {
            attribute_id: id,
            value: newValue,
          }),
        ],
      };
    }

    setVariants(_variants);
    set_Trigger(_trigger + 1);
    setTrigger(trigger + 1);
    set_SelectedRow__(row);
    set_Trigger__(_trigger__ + 1);
  };


  const imagesFile1 = (fileURL, id, selectedRow) => {
    const tempFile = [...parentFiles];
    tempFile.push({ src: fileURL, id: id, refer_id: selectedRow });
    setParentFiles(tempFile);
  };

  useEffect(() => {
    let imagePreviewArr = [];
    if (imagePreview[selectedRow] != undefined) {
      imagePreviewArr = [...imagePreview[selectedRow]];
    }
    let _imagePreview = [...imagePreview];
    let formData = new FormData();
    formData.append("file", imageFile);
    if (imageFile && formData) {
      axiosConfig
        .post("/admin/uploader", formData)
        .then((res) => {
          imagePreviewArr.push({
            src: res.data.files[0].image_url,
            id: res.data.files[0].file_id,
          });
          _imagePreview[selectedRow] = imagePreviewArr;
          setImagePreview([..._imagePreview]);
          imagesFile1(
            res.data.files[0].image_url,
            res.data.files[0].file_id,
            selectedRow
          );
        })
        .catch((error) => {
          setNotificationObj({
            open: true,
            type: "failed",
            message: `Add uploder dosen't work! `,
          });
          setTimeout(
            () =>
              setNotificationObj({
                open: false,
                type: "failed",
                message: "",
              }),
            6000
          );
        });
    }
  }, [selectedRow, _trigger_]);

  const handleImagePreview = (e, row) => {
    let imageBase = URL.createObjectURL(e.target.files[0]);
    let imageFiles = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = function (e) {
      var image = new Image();

      image.src = e.target.result;
      image.onload = function () {
        var height = this.height;
        var width = this.width;
        if (height == width) {
          setBase(imageBase);
          setImageFile(imageFiles);
          setSelectedRow(row);
          set_Trigger_(_trigger_ + 1);
        } else {
          setNotificationObj({
            open: true,
            type: "error",
            message: `Please upload an image with a 1:1 aspect ratio`,
          });
          setTimeout(
            () =>
              setNotificationObj({
                open: false,
                type: "success",
                message: "",
              }),
            3000
          );
        }
      };
    };
  };

  useEffect(() => {
    let imagePreviewBasicArr = [];
    imagePreviewBasicArr = [...imagePreviewBasic];

    let _imagePreviewBasic = [...imagePreviewBasic];
    let formData = new FormData();
    formData.append("file", imageFileBasic);
    if (imageFileBasic && formData) {
      axiosConfig
        .post("/admin/uploader", formData)
        .then((res) => {
          imagePreviewBasicArr.push({
            src: res.data.files[0].image_url,
            id: res.data.files[0].file_id,
          });
          _imagePreviewBasic = imagePreviewBasicArr;
          setImagePreviewBasic([..._imagePreviewBasic]);
          setProductGroupImage([..._imagePreviewBasic]);
        })
        .catch((error) => {
          setNotificationObj({
            open: true,
            type: "failed",
            message: `Add uploader has a problem! `,
          });
          setTimeout(
            () =>
              setNotificationObj({
                open: false,
                type: "failed",
                message: "",
              }),
            6000
          );
        });
    }
  }, [_numberBasic]);

  const handleImagePreviewBasic = (e) => {
    let imageBase = URL.createObjectURL(e.target.files[0]);
    let imageFiles = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    let type = imageFiles.type;
    let numberOfAddImage = imageNumber;
    if (
      type.split("/")[1] == "png" ||
      type.split("/")[1] == "jpg" ||
      type.split("/")[1] == "jpeg" ||
      type.split("/")[1] == "jfif" ||
      type.split("/")[1] == "pjpeg" ||
      type.split("/")[1] == "pjp" ||
      type.split("/")[1] == "svg"
    ) {
      setImageNumber(imageNumber + 1);
      numberOfAddImage = numberOfAddImage + 1;
    } else if (type.split("/")[1] == "mp4") {
      setVideoNumber(videoNumber + 1);
      numberOfAddImage = numberOfAddImage + 1;
    }

    reader.onload = function (e) {
      var image = new Image();

      image.src = e.target.result;
      image.onload = function () {
        var height = this.height;
        var width = this.width;
        if (height == width && numberOfAddImage <= 2) {
          setBase(imageBase);
          setImageFileBasic(imageFiles);
          set_NumberBasic(_numberBasic + 1);
        } else if (numberOfAddImage > 2) {
          setNotificationObj({
            open: true,
            type: "error",
            message: `You can just add 2 image`,
          });
          setTimeout(
            () =>
              setNotificationObj({
                open: false,
                type: "success",
                message: "",
              }),
            3000
          );
        } else {
          setNotificationObj({
            open: true,
            type: "error",
            message: `Please upload an image with a 1:1 aspect ratio`,
          });
          setTimeout(
            () =>
              setNotificationObj({
                open: false,
                type: "success",
                message: "",
              }),
            3000
          );
        }
      };
    };
  };

  const handleCloseDialogDelete = () => {
    setOpenDeleteVariant(false);
  };

  const checkIsEmpty = () => {
    if (validatedItemCode) {
      if (
        productGroupImage.length !== 0 &&
        imagePreview.length !== 0 &&
        variants.length !== 0 &&
        nameArabic !== "" &&
        name.length !== ""
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  const handleDelteTag = (row, basicOrVarient, index) => {
    if (basicOrVarient) {
      const filterTags = tagValueBasic.filter((elem, index1) => index1 != row);
      setTagValueBasic(filterTags);
    } else {
      if (tagValue[row] != undefined) {
        if (
          tagValue[row].length == 1 ||
          (Object.getPrototypeOf(tagValue[row][tagValue[row].length - 1]) ===
            Object.prototype &&
            tagValue[row][tagValue[row].length - 1].length == undefined)
        ) {
          const filterTagsOfRow = tagValue[row].filter(
            (elem, index1) => index1 != index
          );
          tagValue[row] = filterTagsOfRow;
        } else if (
          tagValue[index] != undefined &&
          tagValue[index][tagValue[index].length - 1] != undefined
        ) {
          const filterTagsOfRow = tagValue[row][
            tagValue[row].length - 1
          ].filter((elem, index1) => index1 != index);
          tagValue[row] = filterTagsOfRow;
        }
      }
    }
    set_Trigger___(_trigger___ + 1);
  };

  return (
    categoryId && (
      <AdminLayout
        breadcrumb={bread}
        pageName={
          JSON.parse(localStorage.getItem("categories")).find(
            (c) => c.id === categoryId
          ).name
        }
      >
        <Grid container spacing={2} className="main">
          <Grid item xs={12} md={12} className="box boxItem">
            <Paper elevation={5} sx={{ width: "100%" }}>
              <Accordion defaultExpanded={true} className="accordionMain">
                <AccordionSummary>
                  <Grid item xs={12} className="numberAndTitle">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          ...commonStyles,
                          borderRadius: "50%",
                          justifyContent: "center",
                          alignItems: "center",
                          paddingTop: 0.4,
                        }}
                      >
                        <Typography
                          align="center"
                          mt={0.5}
                          pl={1.4}
                          color="Black.main"
                          variant="menuitem"
                        >
                          1
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      align="center"
                      attribute="menuitem"
                      mt={0.5}
                      ml={2}
                      variant="menuitem"
                      color="Black.main"
                    >
                      Basic Information
                    </Typography>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails className="boxTitle">
                  {categoryId !== "" && (
                    <Grid item xs={4} p={1}>
                      <FormControl fullWidth>
                        <InputLabel id="category" color="P">
                          Category
                        </InputLabel>
                        <Select
                          IconComponent={KeyboardArrowDownIcon}
                          labelId="category"
                          id="demo-simple-select"
                          color="P"
                          disabled
                          defaultValue={categoryId}
                          label="Category"
                          onChange={(e) => setCategoryId(e.target.value)}
                        >
                          {JSON.parse(localStorage.getItem("categories")).map(
                            (category) => {
                              return (
                                <MenuItem value={category.id}>
                                  {category.name}
                                </MenuItem>
                              );
                            }
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}

                  <Grid item xs={4} p={1}>
                    <TextField
                      id="outlined-attribute"
                      color="P"
                      label={
                        categoryId == 371 ||
                        categoryId == 372 ||
                        categoryId == 373
                          ? "Model Number"
                          : "Name"
                      }
                      variant="outlined"
                      required
                      fullWidth
                      onChange={(e) => setProductGroupName(e.target.value)}
                      value={name}
                    ></TextField>
                  </Grid>
                  <Grid item xs={4} p={1}>
                    <TextField
                      id="outlined-attribute"
                      color="P"
                      label="Arabic Name"
                      variant="outlined"
                      required
                      fullWidth
                      onChange={(e) =>
                        setProductGroupArabicName(e.target.value)
                      }
                      value={nameArabic}
                    ></TextField>
                  </Grid>
                  <Grid item xs={12} p={1}>
                    <TextField
                      id="outlined-attribute"
                      label="Description"
                      multiline
                      rows={4}
                      required
                      fullWidth
                      color="P"
                      onChange={(e) =>
                        setProductGroupDescription(e.target.value)
                      }
                      value={description}
                    />
                  </Grid>
                  
                  <Grid item xs={12} display="flex" flexWrap="wrap">
                    {imagePreviewBasic.length != 0 &&
                      imagePreviewBasic.map((cardImage, index1) => {
                        return (
                          <Grid p={2} display="flex">
                            <Card
                              style={{
                                width: "133px",
                                display: "flex",
                                justifyContent: "center",
                                position: "relative",
                              }}
                            >
                              <CardMedia
                                component="img"
                                image={
                                  axiosConfig.defaults.baseURL + cardImage.src
                                }
                              />

                              <Grid
                                xs={12}
                                position="absolute"
                                display="flex"
                                justifyContent="space-between"
                                style={{
                                  width: "100%",
                                  backgroundImage:
                                    "linear-gradient(180deg,  rgba(0,0,1,1), rgba(0,0,0,0))",
                                }}
                              >
                                {cardImage.id == starImage ? (
                                  <Grid item mt={0.3} ml={0.3}>
                                    <IconButton aria-label="delete">
                                      <StarIcon color="P" fontSize="small" />
                                    </IconButton>
                                  </Grid>
                                ) : (
                                  <Grid
                                    item
                                    mt={0.3}
                                    ml={0.3}
                                    style={{
                                      backgroundColor: "white",
                                      borderRadius: "50%",
                                    }}
                                  >
                                    <IconButton
                                      aria-label="delete"
                                      onClick={() => {
                                        setStarImage(cardImage.id);
                                        setStarId(cardImage.id);
                                      }}
                                    >
                                      <StarBorderIcon fontSize="small" />
                                    </IconButton>
                                  </Grid>
                                )}

                                <Grid item mt={0.3} ml={0.3}>
                                  <IconButton
                                    aria-label="delete"
                                    onClick={() => {
                                      set_Trigger(_trigger + 1);
                                      imagePreviewBasic.splice(index1, 1);
                                      setProductGroupImage(imagePreviewBasic);
                                      setImagePreviewBasic(imagePreviewBasic);
                                      setImageFileBasic(null);
                                    }}
                                  >
                                    <DeleteIcon
                                      color="White"
                                      fontSize="small"
                                    />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </Card>
                          </Grid>
                        );
                      })}
                    <Grid p={2} display="flex" direction="row">
                      <label htmlFor={`contained-button-file`}>
                        <Input
                          accept="image/*, video/*"
                          id={`contained-button-file`}
                          multiple
                          type="file"
                          onChange={(e) => {
                            handleImagePreviewBasic(e);
                            setNumberBasic(numberBasic + 1);
                          }}
                          disabled={imageNumber == 2 && videoNumber == 1}
                        />
                        <Tooltip title="Ratio must be 1:1 (recomended size is 2000 x 2000 px)">
                          <Button
                            variant="contained"
                            component="span"
                            color="P"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              flexDirection: "column",
                              background: "rgba(203, 146, 155, 0.1)",
                              justifyContent: "center",
                              width: "100%",
                              height: "110px",
                              color: "P.main",
                              fontSize: "14px",
                              fontWeight: "400",
                            }}
                            size="small"
                          >
                            <AddIcon />
                            Upload Picture
                          </Button>
                        </Tooltip>
                      </label>
                    </Grid>
                    <Notification
                      open={notificationObj.open}
                      type={notificationObj.type}
                      message={notificationObj.message}
                    />
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <Grid item xs={12} md={12} display="flex" flexWrap="wrap">
                      <Grid item xs={12} md={12} display="flex" flexWrap="wrap">
                        {tagValueBasic &&
                          tagValueBasic.map((tag, index) => {
                            return (
                              <Grid key={index} item p={1}>
                                <Chip
                                  variant="outlined"
                                  label={tag.title}
                                  onDelete={() => handleDelteTag(index, true)}
                                  deleteIcon={<CloseIcon />}
                                />
                              </Grid>
                            );
                          })}
                        <Button
                          onClick={() => handleClickOpenDialogTags("")}
                          startIcon={<AddIcon />}
                          color="P"
                          sx={{ textTransform: "unset" }}
                        >
                          Product Tags
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Paper>
          </Grid>
          <Grid item xs={12} md={12} className="box boxItem">
            <Accordion defaultExpanded={true} className="accordionMain">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Grid item xs={12} md={12} className="numberAndTitle">
                  <Box
                    sx={{
                      ...commonStyles,
                      borderRadius: "50%",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingTop: 0.4,
                    }}
                  >
                    <Typography
                      align="center"
                      mt={0.5}
                      pl={1.4}
                      color="Black.main"
                      variant="menuitem"
                    >
                      2
                    </Typography>
                  </Box>
                  <Typography
                    align="center"
                    attribute="menuitem"
                    mt={0.5}
                    ml={2}
                    variant="menuitem"
                    color="Black.main"
                  >
                    General Information
                  </Typography>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid item xs={12} display="flex" flexWrap="wrap">
                  {attributes.map((attribute) => {
                    return attribute.is_variant ? (
                      ""
                    ) : attribute.type === 1 ? (
                      <Grid item xs={4} p={1}>
                        <FormControl fullWidth>
                          <InputLabel
                            id={attribute.title}
                            color="P"
                            required={attribute.is_optional}
                          >
                            {attribute.title.charAt(0).toUpperCase() +
                              attribute.title.slice(1)}
                          </InputLabel>
                          <Select
                            IconComponent={KeyboardArrowDownIcon}
                            labelId={attribute.title}
                            id="demo-simple-select-required"
                            color="P"
                            label={attribute.title}
                            onChange={(e) => {
                              handleChangeAttribute(
                                attribute.id,
                                e.target.value
                              );
                            }}
                          >
                            <MenuItem
                              value="None"
                              disabled={attribute.is_optional}
                            >
                              None
                            </MenuItem>
                            
                            {attribute.values.map((value) => {
                              return (
                                <MenuItem value={value.id}>
                                  {value.value}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                    ) : (
                      ""
                    );
                  })}

                  <Grid item xs={12} p={1}></Grid>

                  {attributes.map((attribute) => {
                    return attribute.is_variant ? (
                      ""
                    ) : attribute.type === 4 ? (
                      <Grid
                        item
                        xs={2}
                        p={1}
                        display="flex"
                        alignItems="center"
                      >
                        <FormControlLabel
                          control={<Switch color="P" name="gilad" />}
                          label={attribute.title}
                          onChange={(e) =>
                            handleChangeAttribute(
                              attribute.id,
                              e.target.checked
                            )
                          }
                        />
                      </Grid>
                    ) : (
                      ""
                    );
                  })}
                  {attributes.map((attribute) => {
                    return attribute.is_variant ? (
                      ""
                    ) : attribute.type === 2 &&
                      attribute.title !== "Name" &&
                      attribute.title !== "Arabic Name" ? (
                      <Grid
                        item
                        xs={2}
                        p={1}
                        display="flex"
                        alignItems="center"
                      >
                        <TextField
                          id="outlined-attribute"
                          color="P"
                          label={attribute.title}
                          variant="outlined"
                          required
                          fullWidth
                          onChange={(e) =>
                            handleChangeAttribute(attribute.id, e.target.value)
                          }
                        ></TextField>
                      </Grid>
                    ) : (
                      ""
                    );
                  })}
                  
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          {selectedMainAttributes.length === 0 ? (
            <Grid xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={() => handleShowVariant()}
                startIcon={<AddIcon />}
                color="P"
                sx={{
                  "&:hover": { backgroundColor: "P.main" },
                  backgroundColor: "P.main",
                  color: "white",
                  display: showVariant ? "none" : "flex",
                }}
              >
                Add Variant
              </Button>
            </Grid>
          ) : (
            ""
          )}
          <Fade in={showVariant}>
            <Grid item xs={12} md={12} className="box boxItem">
              <Grid item xs={12} md={12}>
                <Accordion expanded={true} defaultExpanded>
                  <AccordionSummary>
                    <Grid item xs={12} md={12} className="spaceBetween">
                      <Grid item xs={5} md={5} className="numberAndTitle">
                        <Box
                          sx={{
                            ...commonStyles,
                            borderRadius: "50%",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingTop: 0.4,
                          }}
                        >
                          <Typography
                            align="center"
                            mt={0.5}
                            pl={1.4}
                            color="Black.main"
                            variant="menuitem"
                          >
                            3
                          </Typography>
                        </Box>
                        <Typography
                          align="center"
                          attribute="menuitem"
                          mt={0.5}
                          ml={2}
                          variant="menuitem"
                          color="Black.main"
                        >
                          Variants
                        </Typography>
                        <Button
                          onClick={() => handleClickOpenDialogVariants()}
                          startIcon={<AddIcon />}
                          color="P"
                          sx={{
                            marginLeft: 2,
                            "&:hover": { backgroundColor: "P.main" },
                            backgroundColor: "P.main",
                            color: "white",
                          }}
                        >
                          Add Main Attribute
                        </Button>
                        <Grid>
                          <Tooltip title="Validate variants item codes">
                            <Button
                              sx={{
                                color:
                                  validatorState == 0
                                    ? "P.main"
                                    : validatorState == 1
                                    ? "yellow"
                                    : validatorState == 2
                                    ? "green"
                                    : "P.main",
                              }}
                              size="small"
                              onClick={() => {
                                ValidateVariants();
                              }}
                            >
                              <RuleIcon />
                            </Button>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails className="boxTitle">
                    <Grid xs={12}>
                      {selectedMainAttributes.map((mainAttr, index) => {
                        return (
                          <Grid xs={12} key={index}>
                            <Accordion defaultExpanded={false} elevation={0}>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                              >
                                <Grid
                                  xs={12}
                                  sx={{ display: "flex", width: "100%" }}
                                >
                                  

                                  {variantDetailLoader(mainAttr, index)}
                                </Grid>
                              </AccordionSummary>
                              <AccordionDetails>
                                
                                <Grid
                                  item
                                  xs={12}
                                  display="flex"
                                  flexWrap="wrap"
                                >
                                  {imagePreview.length != 0 &&
                                    imagePreview[index] != undefined &&
                                    imagePreview[index].map(
                                      (cardImage, index1) => {
                                        return (
                                          <Grid p={2} display="flex">
                                            <Card
                                              style={{
                                                width: "133px",
                                                display: "flex",
                                                justifyContent: "center",
                                                position: "relative",
                                              }}
                                            >
                                              <CardMedia
                                                component="img"
                                                image={
                                                  axiosConfig.defaults.baseURL +
                                                  cardImage.src
                                                }
                                              />

                                              <Grid
                                                xs={12}
                                                position="absolute"
                                                display="flex"
                                                justifyContent="space-between"
                                                style={{
                                                  width: "100%",
                                                  backgroundImage:
                                                    "linear-gradient(180deg,  rgba(0,0,1,1), rgba(0,0,0,0))",
                                                }}
                                              >
                                                <Grid item mt={0.3} ml={0.3}>
                                                  <IconButton
                                                    aria-label="delete"
                                                    onClick={() => {
                                                      set_Trigger(_trigger + 1);
                                                      imagePreview[
                                                        index
                                                      ].splice(index1, 1);
                                                      setImagePreview(
                                                        imagePreview
                                                      );
                                                      setImageFile(null);
                                                    }}
                                                  >
                                                    <DeleteIcon
                                                      color="White"
                                                      fontSize="small"
                                                    />
                                                  </IconButton>
                                                </Grid>
                                              </Grid>
                                            </Card>
                                          </Grid>
                                        );
                                      }
                                    )}

                                  <Grid p={2} display="flex" direction="row">
                                    <label
                                      htmlFor={`contained-button-file_${index}`}
                                    >
                                      <Input
                                        accept="image/*"
                                        id={`contained-button-file_${index}`}
                                        multiple
                                        type="file"
                                        disabled={emptyVariantRow[index]}
                                        onChange={(e) => {
                                          handleImagePreview(e, index);
                                          set_Trigger(_trigger + 1);
                                        }}
                                      />
                                      <Tooltip title="Ratio must be 1:1 (recomended size is 2000 x 2000 px)">
                                        <Button
                                          variant="contained"
                                          component="span"
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            flexDirection: "column",
                                            background:
                                              "rgba(203, 146, 155, 0.1)",
                                            justifyContent: "center",
                                            width: "100%",
                                            height: "110px",
                                            color: "#CB929B",
                                            fontSize: "14px",
                                            fontWeight: "400",
                                          }}
                                          size="small"
                                        >
                                          <AddIcon />
                                          Upload Picture
                                        </Button>
                                      </Tooltip>
                                    </label>
                                  </Grid>
                                  <Grid
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                      width: "auto",
                                      position: "absolute",
                                      right: -5,
                                      top: 60,
                                    }}
                                  >
                                    <Grid>
                                      <Tooltip title="Download CSV File for current category">
                                        <Button
                                          sx={{ color: "P.main" }}
                                          size="small"
                                          onClick={() => {
                                            generateCSV(mainAttr, index);
                                          }}
                                        >
                                          <DownloadIcon />
                                        </Button>
                                      </Tooltip>
                                    </Grid>
                                    <Grid>
                                      <Tooltip title="Upload CSV File for current category">
                                        <Button
                                          sx={{ color: "P.main" }}
                                          size="small"
                                        >
                                          <input
                                            type="file"
                                            id="input"
                                            multiple
                                          />
                                        </Button>
                                      </Tooltip>
                                    </Grid>
                                    <Grid>
                                      <Tooltip title="Validate CSV File and import data">
                                        <Button
                                          sx={{ color: "P.main" }}
                                          size="small"
                                          onClick={() => {
                                            readCSV(mainAttr, index);
                                          }}
                                        >
                                          <StartIcon />
                                        </Button>
                                      </Tooltip>
                                    </Grid>
                                    <Grid>
                                      <Tooltip title="Add description">
                                        <Button
                                          sx={{ color: "P.main" }}
                                          size="small"
                                          onClick={() =>
                                            addMainAttributeDescription(
                                              mainAttr,
                                              index
                                            )
                                          }
                                        >
                                          <DescriptionOutlinedIcon />
                                        </Button>
                                      </Tooltip>
                                    </Grid>
                                  </Grid>
                                  

                                  {mainAttribueDescriptionLoader(
                                    mainAttr,
                                    index
                                  )}
                                  <Notification
                                    open={notificationObj.open}
                                    type={notificationObj.type}
                                    message={notificationObj.message}
                                  />
                                </Grid>
                                {variants.map((variant, row) => {
                                  if (
                                    variant.mainAttribute[0].value === mainAttr
                                  ) {
                                    return (
                                      <Grid
                                        item
                                        ml={10}
                                        xs={12}
                                        display="flex"
                                        flexWrap="wrap"
                                      >
                                        <Accordion
                                          elevation={0}
                                          defaultExpanded={true}
                                          sx={{ width: "100%" }}
                                        >
                                          <AccordionSummary {...accordionProps}>
                                            <Grid
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                alignContent: "center",
                                              }}
                                            >
                                              <Typography color={"P.main"}>
                                                Variant
                                              </Typography>
                                              <Typography
                                                ml={1}
                                                align="center"
                                                color="P.main"
                                                variant="menuitem"
                                              >
                                                {row + 1}
                                              </Typography>
                                            </Grid>
                                          </AccordionSummary>
                                          <AccordionDetails
                                            sx={{
                                              borderLeft: 1,
                                              borderColor: "P.main",
                                            }}
                                          >
                                            <Grid
                                              sx={{
                                                position: "absolute",
                                                right: 10,
                                                bottom: 15,
                                                zIndex: 2000,
                                              }}
                                            >
                                              {variant.has_description ? (
                                                ""
                                              ) : (
                                                <Tooltip title="Add description">
                                                  <Button
                                                    sx={{ color: "P.main" }}
                                                    size="small"
                                                    onClick={() =>
                                                      addVariantDescription(row)
                                                    }
                                                  >
                                                    <DescriptionOutlinedIcon />
                                                  </Button>
                                                </Tooltip>
                                              )}
                                              <Tooltip
                                                title="Delete this variant!"
                                                placement="top"
                                              >
                                                <Button
                                                  sx={{ color: "P.main" }}
                                                  size="small"
                                                  onClick={() => {
                                                    if (variants.length <= 1) {
                                                      setNotificationObj({
                                                        open: true,
                                                        type: "failed",
                                                        message: `Product must have at least one variant.`,
                                                      });
                                                      setTimeout(
                                                        () =>
                                                          setNotificationObj({
                                                            open: false,
                                                            type: "failed",
                                                            message: "",
                                                          }),
                                                        6000
                                                      );
                                                    }else{
                                                      deleteSelectedVariant(
                                                        row,
                                                        mainAttr
                                                      );
                                                    }
                                                  }}
                                                >
                                                  <DeleteIcon />
                                                </Button>
                                              </Tooltip>
                                            </Grid>
                                            {sideAttributesLoader(variant, row)}
                                            {customAttributesLoader(
                                              variant,
                                              row
                                            )}
                                            {variant.has_description ? (
                                              <Grid
                                                item
                                                xs={12}
                                                p={1}
                                                sx={{ position: "relative" }}
                                              >
                                                <TextField
                                                  id="outlined-attribute"
                                                  label="Description"
                                                  multiline
                                                  rows={4}
                                                  required
                                                  fullWidth
                                                  color="P"
                                                  onChange={(e) =>
                                                    changeVariantDescription(
                                                      row,
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                                <Grid
                                                  sx={{
                                                    position: "absolute",
                                                    right: 10,
                                                    bottom: 15,
                                                    zIndex: 100,
                                                  }}
                                                >
                                                  <Tooltip
                                                    title="delete description"
                                                    placement="top"
                                                  >
                                                    <Button
                                                      sx={{ color: "P.main" }}
                                                      size="small"
                                                      onClick={() =>
                                                        deleteVariantDescription(
                                                          row
                                                        )
                                                      }
                                                    >
                                                      <DeleteIcon />
                                                    </Button>
                                                  </Tooltip>
                                                </Grid>
                                              </Grid>
                                            ) : (
                                              ""
                                            )}

                                            <Grid
                                              item
                                              xs={12}
                                              md={12}
                                              display="flex"
                                              flexWrap="wrap"
                                            >
                                              {tagValueBasic &&
                                                tagValueBasic.map((tag) => {
                                                  return (
                                                    <Grid item p={1}>
                                                      <Chip
                                                        variant="outlined"
                                                        label={tag.title}
                                                      />
                                                    </Grid>
                                                  );
                                                })}
                                              {tagValue[row] != undefined
                                                ? tagValue[row] != undefined &&
                                                  (tagValue[row].length == 1 ||
                                                    tagValue[row].length == 0 ||
                                                    (Object.getPrototypeOf(
                                                      tagValue[row][
                                                        tagValue[row].length - 1
                                                      ]
                                                    ) === Object.prototype &&
                                                      tagValue[row][
                                                        tagValue[row].length - 1
                                                      ].length == undefined))
                                                  ? tagValue[row].map(
                                                      (tag, index1) => {
                                                        return (
                                                          <Grid item p={1}>
                                                            <Chip
                                                              variant="outlined"
                                                              label={tag.title}
                                                              onDelete={() =>
                                                                handleDelteTag(
                                                                  row,
                                                                  false,
                                                                  index1
                                                                )
                                                              }
                                                              deleteIcon={
                                                                <CloseIcon />
                                                              }
                                                            />
                                                          </Grid>
                                                        );
                                                      }
                                                    )
                                                  : tagValue[row] !=
                                                      undefined &&
                                                    tagValue[row][
                                                      tagValue[row].length - 1
                                                    ] != undefined &&
                                                    tagValue[row][
                                                      tagValue[row].length - 1
                                                    ].map((tag, index1) => {
                                                      return (
                                                        <Grid item p={1}>
                                                          <Chip
                                                            variant="outlined"
                                                            label={tag.title}
                                                            onDelete={() =>
                                                              handleDelteTag(
                                                                index,
                                                                false,
                                                                index1
                                                              )
                                                            }
                                                            deleteIcon={
                                                              <CloseIcon />
                                                            }
                                                          />
                                                        </Grid>
                                                      );
                                                    })
                                                : ""}
                                              <Button
                                                onClick={() =>
                                                  handleClickOpenDialogTags(row)
                                                }
                                                startIcon={<AddIcon />}
                                                color="P"
                                                sx={{ textTransform: "unset" }}
                                              >
                                                Variant Tags
                                              </Button>
                                            </Grid>
                                          </AccordionDetails>
                                        </Accordion>
                                      </Grid>
                                    );
                                  }
                                })}
                                <Grid
                                  ml={10}
                                  mt={5}
                                  sx={{
                                    position: "absolute",
                                    right: 25,
                                    bottom: 20,
                                  }}
                                >
                                  <Tooltip title="Duplicate variant with the same main attribute">
                                    <Button
                                      sx={{ color: "P.main" }}
                                      size="small"
                                      onClick={() =>
                                        duplicateVariant(mainAttr, index)
                                      }
                                    >
                                      <DifferenceIcon />
                                    </Button>
                                  </Tooltip>
                                </Grid>
                              </AccordionDetails>
                              <Divider sx={{ marginTop: 3 }} />
                            </Accordion>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Fade>
          
          <Grid item xs={12} p={0} display="flex" justifyContent="end">
            <Button
              variant="outlined"
              color="G1"
              sx={{ mr: 1, ml: 1 }}
              onClick={() => history.push("/admin/product")}
            >
              Cancel
            </Button>
            {!disabledSave && (
              <Tooltip title="Product Group image, Variants image, Product Group name and arabic name and at least 1 variant is required!">
                <Grid>
                  <Button
                    variant="contained"
                    color="P"
                    sx={{ mr: 1, ml: 1, color: "white" }}
                    onClick={addProduct}
                    disabled={checkIsEmpty()}
                  >
                    save
                  </Button>
                </Grid>
              </Tooltip>
            )}
            {disabledSave && <CircularProgress sx={{ width: 10, ml: 5 }} />}
          </Grid>
          <Dialog
            maxWidth="sm"
            xs={12}
            open={openAddTag}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Grid container p={1} xs={12}>
              <Grid item xs={3} display="flex" justifyContent="center" m={2}>
                <Typography
                  variant="menutitle"
                  color="black"
                  style={{ width: "400px" }}
                >
                  Add Tag
                </Typography>
              </Grid>
            </Grid>
            <Divider />
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            ></Grid>
            <Grid container p={2} xs={12}>
              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={tags}
                disableCloseOnSelect
                onChange={(event, newValue) => {
                  set_TagValue(newValue);
                  _tagValue_[_selectedRow] = newValue;
                }}
                value={_tagValue}
                getOptionLabel={(option) => option.title}
                renderOption={(props, option, { selected }) => (
                  <li
                    {...props}
                    style={
                      tagValueBasic.find((tag) => tag.id == option.id) && {
                        pointerEvents: "none",
                      }
                    }
                  >
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      style={{ marginRight: 8 }}
                      checked={
                        tagValueBasic.find((tag) => tag.id == option.id)
                          ? true
                          : selected
                      }
                      color="P"
                      disabled={tagValueBasic.find(
                        (tag) => tag.id == option.id
                      )}
                    />
                    {option.title}
                  </li>
                )}
                style={{ width: 500 }}
                renderInput={(params) => (
                  <TextField {...params} label="Tags" color="P" />
                )}
              />
            </Grid>
            <Divider />
            <Grid item xs={12} pr={2} display="flex" justifyContent="end">
              <Button
                variant="outlined"
                color="G1"
                onClick={() => handleCloseDialog("Variants")}
                sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="P"
                sx={{
                  mt: 2,
                  mb: 2,
                  mr: 1,
                  ml: 1,
                  color: "white",
                }}
                onClick={() => updateTagList("Variants")}
              >
                Save
              </Button>
            </Grid>
          </Dialog>

          <Dialog
            maxWidth="sm"
            xs={12}
            open={openAddTagBasic}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Grid container p={1} xs={12}>
              <Grid item xs={3} display="flex" justifyContent="center" m={2}>
                <Typography
                  variant="menutitle"
                  color="black"
                  style={{ width: "400px" }}
                >
                  Add Tag
                </Typography>
              </Grid>
            </Grid>
            <Divider />
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            ></Grid>
            <Grid container p={2} xs={12}>
              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={tags}
                disableCloseOnSelect
                onChange={(event, newValue) => {
                  setTagValueBasic(newValue);
                }}
                value={tagValueBasic}
                getOptionLabel={(option) => option.title}
                renderOption={(props, option, { selected }) => (
                  <li
                    {...props}
                    style={
                      tagValueBasic.find((tag) => tag.id == option.id) && {
                        pointerEvents: "none",
                      }
                    }
                  >
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      style={{ marginRight: 8 }}
                      checked={
                        tagValueBasic.find((tag) => tag.id == option.id)
                          ? true
                          : selected
                      }
                      color="P"
                      disabled={tagValueBasic.find(
                        (tag) => tag.id == option.id
                      )}
                    />
                    {option.title}
                  </li>
                )}
                style={{ width: 500 }}
                renderInput={(params) => (
                  <TextField {...params} label="Tags" color="P" />
                )}
              />
            </Grid>
            <Divider />
            <Grid item xs={12} pr={2} display="flex" justifyContent="end">
              <Button
                variant="outlined"
                color="G1"
                onClick={() => handleCloseDialog("Basic")}
                sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="P"
                sx={{
                  mt: 2,
                  mb: 2,
                  mr: 1,
                  ml: 1,
                  color: "white",
                }}
                onClick={() => updateTagList("Basic")}
              >
                Save
              </Button>
            </Grid>
          </Dialog>

          <Dialog
            open={openDeleteVariant}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Grid
              xs={12}
              display="flex"
              justifyContent="center"
              mt={3}
              mb={1}
              ml={3}
              mr={6}
            >
              <Typography>
                Are you sure you want to delete current row?
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              paddingLeft={1}
              paddingRight={1}
              display="flex"
              justifyContent="end"
            >
              <Button
                variant="contained"
                color="P"
                sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "white" }}
                onClick={() => clickRemoveVariant(_selectedRow_)}
              >
                Delete
              </Button>

              <Button
                variant="outlined"
                color="G1"
                onClick={handleCloseDialogDelete}
                sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
              >
                Cancel
              </Button>
            </Grid>
          </Dialog>
        </Grid>
        <Grid>
          <Dialog
            open={openVariant}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Grid
              xs={12}
              display="flex"
              justifyContent="center"
              mt={3}
              mb={1}
              ml={3}
              mr={6}
            >
              <Typography>Do you want to add a new varient?</Typography>
            </Grid>
            <Grid
              item
              xs={12}
              paddingLeft={1}
              paddingRight={1}
              display="flex"
              justifyContent="end"
            >
              <Button
                variant="contained"
                color="P"
                sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "white" }}
                onClick={chooseMainAttributeDialog}
              >
                Continue
              </Button>

              <Button
                variant="outlined"
                color="G1"
                onClick={handleClickOpenDialogVariants}
                sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
              >
                Cancel
              </Button>
            </Grid>
          </Dialog>
        </Grid>
        
        <Grid>
          <Dialog
            open={openChooseMain}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Grid
              xs={12}
              display="flex"
              justifyContent="center"
              mt={3}
              mb={1}
              ml={3}
              mr={6}
            >
              <Typography>Select the main attribute.</Typography>
            </Grid>
            <Grid>
              {selectedProductsMainAttribute
                ? mainAttributeComponentLoader()
                : ""}
            </Grid>

            <Grid
              item
              xs={12}
              paddingLeft={1}
              paddingRight={1}
              display="flex"
              justifyContent="end"
              alignItems="center"
            >
              {selectedProductsMainAttribute.type == 2 ? (
                <Grid md={12} p={1}>
                  <Tooltip title="Add new value to the main attribue">
                    <Button
                      onClick={() => enterAttributeOpenDialog()}
                      variant="contained"
                      color="P"
                      sx={{ mr: 1, color: "white" }}
                    >
                      Add
                    </Button>
                  </Tooltip>
                </Grid>
              ) : (
                ""
              )}
              <Button
                variant="contained"
                color="P"
                sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "white" }}
                disabled={selectedMainAttributes ? false : true}
                onClick={
                  selectedMainAttributeText.length == 0 ||
                  selectedMainAttributeText == ""
                    ? variantsCreator
                    : handleSelectTextAttribute
                }
              >
                Select
              </Button>

              <Button
                variant="outlined"
                color="G1"
                onClick={chooseMainAttributeCloseDialog}
                sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
              >
                Cancel
              </Button>
            </Grid>
          </Dialog>
        </Grid>
        <Grid>
          <Dialog
            open={openAddValue}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Grid
              xs={12}
              display="flex"
              justifyContent="center"
              mt={3}
              mb={1}
              ml={3}
              mr={6}
            >
              <Typography>Enter a title for your attribute</Typography>
            </Grid>
            <Grid paddingLeft={1} paddingRight={1}>
              <TextField
                id="outlined-attribute"
                color="P"
                label={selectedProductsMainAttribute.title}
                variant="outlined"
                required
                fullWidth
                onChange={(e) => setSelectedMainAttributeText(e.target.value)}
              ></TextField>
            </Grid>
            <Grid
              item
              xs={12}
              paddingLeft={1}
              paddingRight={1}
              display="flex"
              justifyContent="end"
            >
              {!disabledAddAttribute && (
                <Button
                  variant="contained"
                  color="P"
                  sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "white" }}
                  disabled={selectedMainAttributeText == "" ? true : false}
                  onClick={() => handleSaveTextAttribute()}
                >
                  Proceed
                </Button>
              )}
              {disabledAddAttribute && (
                <CircularProgress color="P" sx={{ width: 5, mr: 3, mt: 2 }} />
              )}

              <Button
                variant="outlined"
                color="G1"
                onClick={enterAttributeCloseDialog}
                sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
              >
                Cancel
              </Button>
            </Grid>
          </Dialog>
        </Grid>
      </AdminLayout>
    )
  );
};
export default AddNewProduct;
