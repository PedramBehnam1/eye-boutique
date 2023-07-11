import React, { useEffect, useState } from "react";
import axiosConfig from "../../../axiosConfig";
import AdminLayout from "../../../layout/adminLayout";
import {
    Tooltip,
    Menu,
    Grid,
    MenuList,
    MenuItem,
    Divider,
    Paper,
    Typography,
    ListItemText,
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
    Pagination,
    Alert,
    InputBase,
    Snackbar,
} from "@mui/material";
import "../../../asset/css/adminPage/addCategory.css";
import AddIcon from "@mui/icons-material/Add";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import Uploader from "./uploader";
import ErrorIcon from '@mui/icons-material/Error';
import SearchIcon from '@material-ui/icons/Search';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import StarIcon from '@mui/icons-material/Star';
import { useTheme, styled } from "@material-ui/styles";
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Fab from '@mui/material/Fab';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useHistory } from "react-router-dom";


const AddAttributes = () => {
    const [openType, setOpenType] = useState(false);
    const [openAtt, setOpenAtt] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [subMenu, setSubMenu] = useState("");
    const [subType, setSubType] = useState("");
    const [attributesList, setAttributesList] = useState([]);
    const [countAttribute, setCountAttribute] = useState(1);
    const [newTypeName, setNewTypeName] = useState('');
    const [loading, setLoading] = useState(true);
    const [newAttName, setNewAttName] = useState([, { language_id: '', value: "" }, { language_id: '', value: "" }]);
    const [newValue, setNewValue] = useState([{
        value:
            [
                { language_id: '', value: "" },
                { language_id: '', value: "" }
            ]
    }]);
    const [newDescription, setNewDescription] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [hasImage, setHasImage] = useState(false);
    const [fileId, setFileId] = useState();
    const [fieldType, setFieldType] = useState();
    const [isParent, setIsParent] = useState(false);
    const [isVariant, setIsVariant] = useState(false);
    const [newLable, setNewLable] = useState([, { value: '' }]);
    const [currentPage, setCurrentPage] = useState(1);
    const [attributeListPage, setAttributeListPage] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [valueArray, setValueArray] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const openEditAndDeleteMenu = Boolean(anchorEl);

    const [selectedRow, setSelectedRow] = useState({});
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedAttribute, setSelectedAttribute] = useState('');
    const [openDeleteError, setOpenDeleteError] = useState(false);
    const [editFlag, setEditFlag] = useState(true);
    const [nameFilter, setNameFilter] = useState('');
    const [attributeName, setAttributeName] = useState("");
    const [editAttributeValue , setEditAttributeValue] = useState([]);
    const [attributeSystemName, setAttributeSystemName] = useState("");
    const [disabledSave, setDisabledSave] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState({ message: '', open: false });

    const [onchangeOff, setOnchangeOff] = useState(false);
    const [isOptional, setIsOptional] = useState(false);
    const [isHidden, setIsHidden] = useState(true);
    const [isDisabled, setIsDisabled] = useState(true);
    const [isEditValue, setIsEditValue] = useState(false);
    const [sort, setSort] = useState(-1);
    const [showMore, setShowMore] = useState(false);
    const [_attributeName, set_AttributeName] = useState('');
    const [clickedButton, setClickedButton] = useState('');
    const [trigger, setTrigger] = useState(0);
    const [_trigger, set_Trigger] = useState('');

    const [isUniqe, setIsUniqe] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState('');
    const [unUniqeValue, setUnUniqeValue] = useState('');
    const [width, setWidth] = useState('');
    const [anchorElSortDate, setAnchorElSortDate] = useState(null);
    const openSortMenu = Boolean(anchorElSortDate);
    const [selectedIndexAtt, setSelectedIndexAtt] = useState(0);
    const [selectedIndexs, setSelectedIndexs] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const [user, setUser] = useState("11");
    let history = useHistory();
    const [role, setRole] = useState('');

    useEffect(() => {
        getUserInfo();
    }, [])

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
                    }).then((res) => {
                        let role1 = "";
                        res.data.roles_list.map(role => {
                            if (role.id == user.role) {
                                setRole(role.title);
                                role1 = role.title;
                            }
                        })
                        if (role1 != "admin" && role1 != "super admin") {
                            history.push("/")
                        }
                    })
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
                    
                    setShowSuccessMessage({ message: 'Get user info has a problem!', open: true });
                } 
            });
    };




    var special = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth', 'Eleventh', 'Twelfth', 'Thirteenth', 'Fourteenth', 'Fifteenth', 'Sixteenth', 'Seventeenth', 'Eighteenth', 'Nineteenth'];
    const Input = styled("input")({
        display: "none",
    });

    const theme = useTheme();

    const listenScrollEvent = () => {
        if (window.scrollY > 180) {
            setIsHidden(false)
        } else {
            setIsHidden(true)
        }
    }

    const getWindowWidth = () => {
        setWidth(window.innerWidth)
    }
    const isClickedAddButton = () => {
        setOpenAtt(localStorage.getItem("isClickedAttribute"))
    }
    useEffect(() => {
        window.addEventListener('scroll', listenScrollEvent)
        window.addEventListener('resize', getWindowWidth)
        window.addEventListener('click', isClickedAddButton)
    }, [])
    useEffect(() => {
        setOpenAtt(localStorage.getItem("isClickedAttribute"))
    }, [localStorage.getItem("isClickedAttribute")])

    useEffect(() => {
        refreshAttributesList(false);
    }, [nameFilter, newValue, sort])
    useEffect(() => {
        if (isEditValue) {
            clickEditAttribute(selectedRow)
            setIsEditValue(false)
        }
    }, [isEditValue])

    useEffect(() => {
        if (_attributeName != '' && clickedButton != '') {
            setSubMenu(subMenuAccessory(_attributeName))
        }
    }, [clickedButton, _trigger, newValue])

    const handleCloseDialogType = () => {
        setValueArray([]);
        setIsEdit(false)
        setOpenType(false);
    };

    const handleClickOpenDialogAtt = () => {
        setOpenAtt(true);
    };

    const handleClickOpenDialogEditValue = () => {
        setOpenEdit(true);
    };

    const handleCloseDialogAtt = () => {
        localStorage.setItem("isClickedAttribute", false)
        setValueArray([])
        setIsEdit(false)
        setOpenAtt(false);
        setAnchorEl(null);
        setNewAttName([, { language_id: '', value: "" }, { language_id: '', value: "" }]);
        setNewLable([, { value: '' }]);
        setNewDescription([]);
        setNewValue([{
            value:
                [
                    { language_id: '', value: "" },
                    { language_id: '', value: "" }
                ]
        }]);
        setFieldType();
        setIsParent(false);
        setIsOptional(false);
        setIsVariant(false);
        setCountAttribute(1)
        setEditFlag(true)
        setOpenEdit(false);
        setOnchangeOff(false);

    };
    const refreshAttributesList = (edited) => {

        axiosConfig.get('/admin/category/attributes')
            .then(res => {
                setLoading(false)
                let fetchedAttributes;
                if (nameFilter != '') {
                    fetchedAttributes = (res.data.attributes.filter(att => att.label != null)).filter(a => a.label.toLowerCase().includes(nameFilter));
                } else {
                    fetchedAttributes = res.data.attributes.filter(att => att.label != null);
                }
                if (sort == -1 || sort == 'Name A_Z') {
                    fetchedAttributes = fetchedAttributes.sort((a, b) => { return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1 })
                } else if (sort == 'Name Z_A') {
                    fetchedAttributes = fetchedAttributes.sort((a, b) => { return a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1 })
                } else if (sort == 'Name Z_A') {
                    fetchedAttributes = fetchedAttributes.sort((a, b) => { return a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1 })
                } else if (sort == 'System name A_Z') {
                    fetchedAttributes = fetchedAttributes.sort((a, b) => { return a.label.toLowerCase() < b.label.toLowerCase() ? -1 : 1 })
                } else if (sort == 'System name Z_A') {
                    fetchedAttributes = fetchedAttributes.sort((a, b) => { return a.label.toLowerCase() < b.label.toLowerCase() ? 1 : -1 })
                }

                setAttributesList(fetchedAttributes);
                if (currentPage == 0) {
                    let result = fetchedAttributes.slice(((currentPage - 1) * 20), currentPage * 20)
                    setAttributeListPage(result);
                    if (edited) {
                        if (selectedIndexs[selectedIndexAtt] == false) {
                            setIsVariant(Object.values(result[selectedIndexAtt])[3]);
                            setIsParent(Object.values(result[selectedIndexAtt])[2]);
                            setIsOptional(result[selectedIndexAtt].is_optional)
                            setSelectedAttribute(result[selectedIndexAtt]);
                            setSelectedRow(result[selectedIndexAtt]);
                            set_AttributeName(result[selectedIndexAtt])
                            setClickedButton(result[selectedIndexAtt])
                            set_Trigger(_trigger + 1)
                        }

                    }
                } else {
                    let result = fetchedAttributes.slice(((currentPage - 1) * 20), currentPage * 20);
                    if (result.length == 0) {
                        result = fetchedAttributes.slice((((currentPage - 1) - 1) * 20), (currentPage - 1) * 20);
                        setCurrentPage(currentPage - 1);
                        setTrigger(trigger + 1)
                    }
                    setAttributeListPage(result);
                    if (edited) {
                        if (selectedIndexs[selectedIndexAtt] == false) {
                            setIsVariant(Object.values(result[selectedIndexAtt])[3]);
                            setIsParent(Object.values(result[selectedIndexAtt])[2]);
                            setIsOptional(result[selectedIndexAtt].is_optional)
                            setSelectedAttribute(result[selectedIndexAtt]);
                            setSelectedRow(result[selectedIndexAtt]);
                            set_AttributeName(result[selectedIndexAtt])
                            setClickedButton(result[selectedIndexAtt])
                            set_Trigger(_trigger + 1)
                        }
                    }

                }

            })
        axiosConfig.get('/admin/language/all')
            .then(res => setLanguages(res.data.languages))
    }

    const handleChange = (event, value) => {
        let result = attributesList.slice(((value - 1) * 20), value * 20);
        if (sort == -1 || sort == 'Name A_Z') {
            result = result.sort((a, b) => { return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1 })
        } else if (sort == 'Name Z_A') {
            result = result.sort((a, b) => { return a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1 })
        } else if (sort == 'Name Z_A') {
            result = result.sort((a, b) => { return a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1 })
        } else if (sort == 'System name A_Z') {
            result = result.sort((a, b) => { return a.label.toLowerCase() < b.label.toLowerCase() ? -1 : 1 })
        } else if (sort == 'System name Z_A') {
            result = result.sort((a, b) => { return a.label.toLowerCase() < b.label.toLowerCase() ? 1 : -1 })
        }
        setAttributeListPage(result)
        setCurrentPage(value)
        window.scroll(0, 0)
    }

    const addNewType = () => {
        setShowSuccessMessage({ message: newTypeName.title[0].value + ' Saved Successfully!', open: true });
    }
    const addNewValue = (e, index, lanId) => {

        let isUniqe = true
        if (newValue.length != 0) {
            newValue.map(values => {
                values.value.map(value => {
                    if (value.value != '' && value.language_id == lanId) {

                        if (e.target.value == value.value) {
                            isUniqe = false
                        }
                    }
                })
            })
        }
        setUnUniqeValue(e.target.value);
        setSelectedIndex(index);
        setIsUniqe(isUniqe);
        if (isUniqe) {
            if (isEdit) {
                valueArray[1] = {
                    language_id: 1,
                    value: newValue[index].value[0].value
                }
            }
            valueArray[lanId] = {
                ...valueArray[lanId],
                language_id: lanId,
                value: e.target.value
            }
            if (lanId === 1) {
                if (!newValue[index].value[lanId + 1]) {
                    newValue[index].value[lanId + 1] = {
                        ...newValue[index].value[lanId + 1],
                        language_id: lanId + 1,
                        value: ''
                    }
                }

            } else {
                if (!newValue[index].value[lanId - 1]) {
                    newValue[index].value[lanId - 1] = {
                        ...newValue[index].value[lanId - 1],
                        language_id: lanId - 1,
                        value: ''
                    }
                }
            }
            newValue[index] = { value: Object.values(valueArray) }
            refreshAttributesList(false);

        } else {
            if (lanId === 1) {
                if (newValue[index].value[lanId - 1]) {
                    newValue[index].value[lanId - 1] = {
                        language_id: lanId,
                        value: ''
                    }
                }

            } else {
                if (newValue[index].value[lanId + 1]) {
                    newValue[index].value[lanId + 1] = {
                        language_id: lanId + 1,
                        value: ''
                    }
                }

                refreshAttributesList(false);
            }
        }


        let result = false;
        newValue.map((valueIndex) => {
            valueIndex.value.map(v => {
                if (result == false) {
                    if (v.value != '') {
                        result = false
                    } else {
                        result = true
                        setIsDisabled(true)
                    }
                }
            })
        })


        if (e.target.value != '' && result == false) {
            setIsDisabled(false)
        }
    }

    const addNewAttributes = () => {

        localStorage.setItem("isClickedAttribute", false)
        const attributeObj = {
            'title': Object.values(newAttName),
            'label': Object.values(newLable),
            'description': [],
            'type': fieldType,
            'is_parent': isParent,
            'is_variant': isParent ? true : isVariant,
            'is_optional': isOptional,
            'values': fieldType === 1 ? Object.values(newValue) : [],
        }
        setDisabledSave(true);
        axiosConfig.post('/admin/category/add_attribute', attributeObj)
            .then(res => {
                setShowSuccessMessage({ message: attributeObj.title[0].value + ' Saved Successfully!', open: true });
                refreshAttributesList(false);
                setIsEdit(false)
                setOpenAtt(false);
                setAnchorEl(null);
                setNewAttName([, { language_id: '', value: "" }, { language_id: '', value: "" }]);
                setNewLable([, { value: '' }]);
                setNewDescription([]);
                setNewValue([{
                    value:
                        [
                            { language_id: '', value: "" },
                            { language_id: '', value: "" }
                        ]
                }]);
                setFieldType();
                setIsParent(false);
                setIsOptional(false);
                setIsVariant(false);
                setCountAttribute([])
                setEditFlag(true)
                setOpenEdit(false);
                setDisabledSave(false);
            })
            .catch(err => {
                setShowSuccessMessage({message: 'Add attribute has a problem!', open: true });
                setDisabledSave(false);
            })

    }

    const clickEditAttribute = (att) => {
        axiosConfig.get(`/admin/category/attributes/check/${selectedRow.id}`)
            .then((res) => {
                setEditFlag(res.data.status);
            })
        setFieldType(att.type)
        setIsEdit(true);
        setEditAttributeValue(att.translated.values);
        setOpenAtt(true);
        setNewValue([]);

        const attributeNewValue = [];
        if (selectedRow.type === 1) {
            if (selectedRow.translated.values !== undefined) {
                selectedRow.translated.values.map(value => {
                    if (attributeNewValue[value.attribute_value_id]) {
                        attributeNewValue[value.attribute_value_id] = { value: [...attributeNewValue[value.attribute_value_id].value, { value: value.value, language_id: value.language_id }] }
                    } else {
                        attributeNewValue[value.attribute_value_id] = { value: [{ value: value.value, language_id: value.language_id }] }
                    }
                })

            }
        }
        setNewValue(Object.values(attributeNewValue))
        localStorage.setItem("isClickedAttribute", true)
    }


    const editAttribute = async () => {

        let title = [];
        let label = [];
        let description = [];
        let values = [];

        setDisabledSave(true);
        setShowMenu(false)

        selectedRow.translated.title.map((value, index) => {
            if (newAttName[value.language_id].value !== '') {
                title.push(newAttName[value.language_id])
            } else {
                title.push({
                    language_id: selectedRow.translated.title[index].language_id,
                    value: selectedRow.translated.title[index].value
                })
            }
        })


        selectedRow.translated.label.map((value, index) => {

            label.push({
                language_id: selectedRow.translated.label[index].language_id,
                value: selectedRow.translated.label[index].value
            })

        })

        const editedObj = {
            "title": title,
            "label": label,
            "description": Object.values(description),
            "type": fieldType ? fieldType : selectedRow.type,
            "is_parent":
                isParent === selectedRow.is_parent ? selectedRow.is_parent : isParent,
            "is_variant": isParent
                ? true
                : isVariant === selectedRow.is_variant
                    ? selectedRow.is_variant
                    : isVariant,
            "is_optional": isOptional,
            "values": fieldType ? fieldType === 1 ? Object.values(newValue) : [] : selectedRow.type === 1 ? Object.values(newValue) : [],

        };

        await axiosConfig
            .put(`/admin/category/edit_attribute/${selectedRow.id}`, editedObj)
            .then((res) => {
                if (res.data.status) {

                    handleCloseDialogAtt();
                    refreshAttributesList(true);


                    setShowSuccessMessage({
                        message: title[0].value + " Edited Successfully!",
                        open: true,
                    });
                    setNewValue([{
                        value:
                            [
                                { language_id: '', value: "" },
                                { language_id: '', value: "" }
                            ]
                    }]);
                    setDisabledSave(false);
                    localStorage.setItem("isClickedAttribute", false);
                }
            })
            .catch((err) => {
                setShowSuccessMessage({message: 'Edit attribute has a problem!', open: true });
                setDisabledSave(false);
            }
            );



    }

    const handleClickDelete = () => {
        setOpenDelete(true)
    }

    const handleCloseDialogDelete = () => {
        setOpenDelete(false)
        setAnchorEl(null)
    }

    const clickDeleteAttribute = async () => {
        await axiosConfig.delete(`/admin/category/remove_attribute/${selectedRow.id}`)
            .then(() => {
                refreshAttributesList(false)
                setSubMenu('')
                setOpenDelete(false)
                setAnchorEl(null);
                setShowSuccessMessage({ message: selectedRow.title + ' Deleted Successfully!', open: true });


            })
            .catch((err) => {
                setOpenDelete(false);
                setOpenDeleteError(true)
            })
    }
    useEffect(() => {
    }, [currentPage])

    const isLoading = () => {
        return (
            <Grid item xs={12} mt={2} mb={2} display='flex' justifyContent='center'>
                <CircularProgress color='P' />
            </Grid>
        )
    }

    const handleClickEditAndDeleteMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseEditAndDeleteMenu = () => {
        setAnchorEl(null);
    };

    const showMoreValues = () => {
        setShowMore(true)
        set_AttributeName(_attributeName)
        set_Trigger(_trigger + 1)
    }

    const showLess = () => {
        setShowMore(false)
        set_AttributeName(_attributeName)
        set_Trigger(_trigger + 1)
    }

    const subMenuAccessory = (attribute) => {
        return (
            <Grid item xs={5} sx={{ width: "100%" }} p={0} mt={-2}>
                <Paper
                    elevation={5}
                    sx={{
                        width: "33vw",
                        position: "fixed",
                    }}
                >
                    <MenuList sx={{ width: "100%" }} disablePadding>
                        <Grid>
                            <Box
                                display="flex"
                                xs={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Grid
                                    xs={12}
                                    display="flex"
                                    sx={{
                                        padding: "10px 20px 10px 20px",
                                        pt: '0',
                                        mt: "10px",
                                        alignItems: "center",
                                        direction: "row",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Grid
                                        display={"flex"}
                                        sx={{
                                            flexDirection: "column",
                                            alignItems: "start",
                                            alignContent: 'flex-start',
                                            flexWrap: 'wrap'
                                        }}
                                    >
                                        <Typography
                                            variant="menutitle"
                                            color="Black.main"
                                            sx={{ textTransform: "capitalize" }}
                                        >
                                            {attribute.title ? attribute.title : "No attribute name!"}
                                        </Typography>
                                        <Typography
                                            color="G2.main"
                                            textTransform='uppercase'
                                            variant="italic"
                                            ml={-0.6}
                                            mt={0.5}
                                        >
                                            ({attribute.label ? attribute.label : "No attribute label!"}
                                            )
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Grid
                                xs={12}
                                display="flex"
                                sx={{
                                    borderBottom: "solid 1px rgba(0, 0, 0, 0.12)",
                                    padding: "10px 20px 10px 20px",
                                    alignItems: "center",
                                    direction: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Grid variant="body" color="Black.main" sx={{ textTransform: "capitalize" }}>
                                    <Typography variant="body" color="G2.main">
                                        attribute type:{" "}
                                        {attribute.type === 1
                                            ? "Dropdown"
                                            : attribute.type === 2
                                                ? "Text-Field"
                                                : attribute.type === 3
                                                    ? "Text-Area"
                                                    : attribute.type === 4
                                                        ? "Switch"
                                                        : "Failed to load attribute type"}
                                    </Typography>
                                    {attribute.is_optional ? (
                                        <Typography sx={{ display: "flex", alignItems: "center" }}>
                                            <CheckBoxIcon color="P" />
                                            compulsory attribute
                                        </Typography>
                                    ) : (
                                        <Typography sx={{ display: "flex", alignItems: "center" }}>
                                            <CheckBoxOutlineBlankIcon color="P" />
                                            optional attribute
                                        </Typography>
                                    )}
                                    <Typography sx={{ display: "flex", alignItems: "center" }}>
                                        {attribute.is_variant ? (
                                            <CheckBoxIcon color="P" />
                                        ) :
                                            (
                                                <CheckBoxOutlineBlankIcon color="P" />

                                            )
                                        }
                                        Variant Attribute
                                    </Typography>

                                    <Typography sx={{ display: "flex", alignItems: "center" }}>
                                        {attribute.is_parent ? (
                                            <CheckBoxIcon color="P" />

                                        ) : (
                                            <CheckBoxOutlineBlankIcon color="P" />

                                        )}
                                        Main Attribute
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid p={2} height={100} overflow='auto'>
                            {attribute.values.length > 0 ? (
                                attribute.values.map((value, index) => {

                                    return showMore == false ? index < 5 && (

                                        <Grid
                                            item
                                            xs={12}
                                            display="inline"
                                            sx={{
                                                alignItems: "center",
                                                direction: "row",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Chip
                                                label={value.value}
                                                variant="outlined"
                                                sx={{ padding: "5px", margin: "4px" }}
                                            />

                                        </Grid>
                                    ) : (
                                        <Grid
                                            item
                                            xs={12}
                                            display="inline"
                                            sx={{
                                                alignItems: "center",
                                                direction: "row",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Chip
                                                label={value.value}
                                                variant="outlined"
                                                sx={{ padding: "5px", margin: "4px" }}
                                            />

                                        </Grid>);
                                })
                            ) : (
                                <Grid
                                    item
                                    xs={12}
                                    display="flex"
                                    sx={{
                                        alignItems: "center",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                    }}
                                >
                                    <NewReleasesIcon color="P" />
                                    <Typography>No description for this attribute</Typography>
                                </Grid>
                            )}
                            {showMore == false && (
                                <Button

                                    color="P"
                                    onClick={() => showMoreValues()}
                                    sx={{ textTransform: 'none' }}

                                >
                                    More Item
                                </Button>
                            )}
                            {(showMore && attribute.values.length > 5) && (
                                <Button

                                    color="P"
                                    onClick={() => showLess()}
                                >
                                    Less Item
                                </Button>
                            )}
                        </Grid>
                    </MenuList>
                </Paper>
            </Grid>
        );
    };



    const clickAddAttribute = () => {
        setValueArray([])
        let newCount = countAttribute + 1;
        setCountAttribute(newCount);
        setNewValue([...newValue, {
            value:
                [
                    { language_id: '', value: "" },
                    { language_id: '', value: "" }
                ]
        }])
        setIsDisabled(true)
    }

    const clickRemoveAttribute = (row) => {
        if (isEdit) {
            const modifiedAttributes = newValue.filter(
                (elem, index) => index != row
            );
            setNewValue(modifiedAttributes);
        } else {
            const modifiedAttributes = newValue.filter(
                (elem, index) => index != row
            );
            setNewValue(modifiedAttributes);
            let newCount = countAttribute - 1;
            setCountAttribute(newCount);
        }

    }

    const bread = [
        {
            title: "Products",
            href: "/admin/product",
        },
    ];

    const AntSwitch = styled(Switch)(({ theme }) => ({
        width: 28,
        height: 16,
        padding: 0,
        display: 'flex',
        '&:active': {
            '& .MuiSwitch-thumb': {
                width: 15,
            },
            '& .MuiSwitch-switchBase.Mui-checked': {
                transform: 'translateX(9px)',
            },
        },
        '& .MuiSwitch-switchBase': {
            padding: 2,
            '&.Mui-checked': {
                transform: 'translateX(12px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    opacity: 1,
                },
            },
        },
        '& .MuiSwitch-thumb': {
            boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
            width: 12,
            height: 12,
            borderRadius: 6,
        },
        '& .MuiSwitch-track': {
            borderRadius: 16 / 2,
            opacity: 1,
            boxSizing: 'border-box',
        },
    }));

    const getHeight = () => {
        return (
            window.innerHeight >= 1350 ?
                window.innerHeight * 1.95 :
                (window.innerHeight >= 1300 ? window.innerHeight * 2 :
                    (window.innerHeight >= 1200 ? window.innerHeight * 1.9 :
                        (window.innerHeight >= 1100 ? window.innerHeight * 1.8 :
                            (window.innerHeight >= 1000 ? window.innerHeight * 1.8 :
                                (window.innerHeight >= 900 ? window.innerHeight * 1.75 :
                                    (window.innerHeight >= 800 ? window.innerHeight * 1.67 :
                                        window.innerHeight >= 700 ? window.innerHeight * 1.59 :
                                            (window.innerHeight >= 600 ? window.innerHeight * 1.44 :
                                                (window.innerHeight >= 500 ? window.innerHeight * 1.34 :
                                                    (window.innerHeight >= 400 ? window.innerHeight * 1.1 : window.innerHeight))))))))))


    }
    const getMargin = () => {
        return (
            window.innerHeight >= 1500 ? 150 :
                (window.innerHeight >= 1400 ? 140 :
                    (window.innerHeight >= 1300 ?
                        132 : (window.innerHeight >= 1200 ? 130 :
                            (window.innerHeight >= 1100 ? 113 :
                                (window.innerHeight >= 1000 ? 97 :
                                    (window.innerHeight >= 900 ? (window.innerHeight >= 950 ? 89 : 80) :
                                        (window.innerHeight >= 800 ? 75 :
                                            window.innerHeight >= 700 ? 65 :
                                                (window.innerHeight >= 600 ? (window.innerHeight >= 650 ? 60 : 46) :
                                                    (window.innerHeight >= 500 ? 33 :
                                                        (window.innerHeight >= 400 ? 23 : 17)))))))))))


    }

    const openSortDate = (event) => {
        setAnchorElSortDate(event.currentTarget)
    }
    return (

        <AdminLayout breadcrumb={bread} pageName="Attributes" >
            {loading ? isLoading() :
                <Grid container spacing={2} >
                    <Grid item xs={7} >
                        <Paper elevation={5} sx={{ width: "100%", minHeight: "75px", marginTop: 0, mb: 0.35, boxShadow: 'none' }}  >
                            <Grid item xs={12} display='flex' justifyContent='space-between' pt={2.5} pl={3} pr={2} mt={0.2} borderRadius={5}>
                                <Typography variant="menutitle" color="Black.main" pt={1} >
                                    Attributes
                                </Typography>
                                <Grid xs={5} display='flex' alignItems='center' justifyContent='end' mt={-0.5} >
                                    <Paper
                                        component="form"
                                        sx={{
                                            p: "2px 4px",
                                            mr: 0.5,
                                            ml: 5,
                                            borderRadius: 3,
                                            display: "flex",
                                            alignItems: "center",
                                            minWidth: "100%",
                                            height: '45px'
                                        }}
                                    >
                                        <IconButton sx={{ p: "10px" }} aria-label="search" >
                                            <SearchIcon color="G1" />
                                        </IconButton>
                                        <InputBase
                                            sx={{ ml: 1, flex: 1 }}
                                            placeholder="Search by Name"
                                            inputProps={{ "aria-label": "Search in List" }}
                                            onChange={(e) => { setNameFilter(e.target.value) }}
                                        />
                                    </Paper>
                                    <IconButton sx={{ p: "10px" }} aria-label="search"
                                        style={{ marginTop: -1 }}
                                        aria-controls={openSortMenu ? 'demo-positioned-date-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={openSortMenu ? 'true' : undefined}
                                        onClick={(event) => { openSortDate(event) }}
                                    >
                                        <FilterListIcon color="G1" />
                                    </IconButton>
                                    <Menu
                                        id="demo-positioned-date-menu"
                                        aria-labelledby="demo-positioned-date-menu"
                                        anchorEl={anchorElSortDate}
                                        open={openSortMenu}
                                        onClose={() => setAnchorElSortDate(null)}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        sx={{ mt: 3, ml: 6 }}
                                    >
                                        <MenuItem
                                            onClick={() => { setSort("Name A_Z") }}
                                        >Name A_Z</MenuItem>
                                        <MenuItem
                                            onClick={() => { setSort("Name Z_A") }}
                                        >Name Z_A</MenuItem>
                                        <MenuItem
                                            onClick={() => { setSort("System name A_Z") }}
                                        >System name A_Z</MenuItem>
                                        <MenuItem
                                            onClick={() => { setSort("System name Z_A") }}
                                        >System name Z_A</MenuItem>
                                    </Menu>
                                </Grid>



                            </Grid>
                        </Paper>
                        <Paper elevation={5} sx={{ width: "100%", minHeight: "531px", marginTop: 0, boxShadow: 'none' }}  >
                            <Divider />
                            <MenuList sx={{ mt: -1 }}>


                                {attributeListPage.map((attributesName, index) => {
                                    let isClickedMoreIcon = false;
                                    return (
                                        <MenuItem
                                            style={{ opacity: 1, padding: 16, borderBottom: attributeListPage.length - 1 === index ? '' : 'solid 1px rgba(0, 0, 0, 0.12)', backgroundColor: attributesName.id === selectedAttribute.id ? 'rgba(76, 73, 75, 0.19)' : '' }}
                                            onClick={() => {
                                                if (isClickedMoreIcon != true) {
                                                    let indexs = [...selectedIndexs];
                                                    if (selectedIndexs[index] == false) {
                                                        indexs[index] = true;
                                                        isClickedMoreIcon = true
                                                        setSubMenu("")
                                                    } else {
                                                        indexs[index] = false;
                                                        indexs.map((i, index1) => {
                                                            if (index != index1) {
                                                                indexs[index1] = true;
                                                            }
                                                        })
                                                    }
                                                    setSelectedIndexs(indexs)
                                                    setTrigger(trigger + 1);
                                                    set_AttributeName(attributesName)
                                                    setClickedButton(attributesName)
                                                    setSelectedAttribute(attributesName);
                                                    setSelectedRow(attributesName);
                                                    setShowMenu(true)
                                                }
                                            }}
                                            sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                                        >
                                            {width > 1280 ? (
                                                <>
                                                    <Typography className="fa fa-search " sx={{ display: "flex", flexDirection: "column" }}>
                                                        {attributesName.is_parent == true ?
                                                            <Tooltip title="This is as a product variants attribute">
                                                                <StarIcon color="P" style={{ height: "19px" }} />
                                                            </Tooltip>
                                                            : ""}
                                                        {attributesName.is_variant == true ?
                                                            <Tooltip title="This is as a product variants main attribute">
                                                                <TurnedInIcon color="P" style={{ height: "19px" }} />
                                                            </Tooltip>
                                                            : ""}
                                                    </Typography>



                                                    <ListItemText>
                                                        <Typography variant="menuitem" color="Black.main">
                                                            {attributesName.title}
                                                        </Typography>

                                                    </ListItemText>
                                                </>
                                            ) :
                                                <Grid display='flex' flexDirection={width >= 954 ? 'row' : 'column'}>
                                                    <Typography className="fa fa-search " sx={{
                                                        display: "flex", flexDirection: width >= 954 ? "column" : 'row', mt: width >= 954 ? (attributesName.is_parent && attributesName.is_variant) ?
                                                            0.5 : 1.5 : 0
                                                    }}>
                                                        {attributesName.is_parent == true ?
                                                            <Tooltip title="This is as a product variants attribute">
                                                                <StarIcon color="P" style={{ height: "19px" }} />
                                                            </Tooltip>
                                                            : ""}
                                                        {attributesName.is_variant == true ?
                                                            <Tooltip title="This is as a product variants main attribute">
                                                                <TurnedInIcon color="P" style={{ height: "19px" }} />
                                                            </Tooltip>
                                                            : ""}
                                                    </Typography>

                                                    <Grid sx={{ display: 'flex', flexDirection: 'column' }}>
                                                        <Typography variant="menuitem" color="Black.main">
                                                            {attributesName.title}
                                                        </Typography>
                                                        <Typography variant="menuitem" color="G2.main" sx={{ fontStyle: 'italic', textTransform: 'uppercase' }}>
                                                            {width >= 954 ? attributesName.label : attributesName.label.length <= 19 ? attributesName.label : ((attributesName.label.length / 2) > 6 ? attributesName.label.substring(0, 19) + "..." : attributesName.label)}

                                                        </Typography>

                                                    </Grid>
                                                </Grid>

                                            }

                                            <Grid className="moreIcone">
                                                {width > 1280 &&
                                                    <Typography variant="menuitem" color="G2.main" sx={{ fontStyle: 'italic', m: 1, textTransform: 'uppercase' }}>
                                                        {attributesName.label}

                                                    </Typography>

                                                }
                                                <IconButton
                                                    aria-label="more"
                                                    id="demo-positioned-menu"
                                                    aria-controls={openEditAndDeleteMenu ? 'demo-positioned-menu' : undefined}
                                                    aria-expanded={openEditAndDeleteMenu ? 'true' : undefined}
                                                    aria-haspopup="true"
                                                    onClick={
                                                        (event) => {
                                                            isClickedMoreIcon = true
                                                            setSelectedIndexAtt(index);
                                                            setSelectedRow(attributesName);
                                                            set_AttributeName(attributesName)
                                                            setIsVariant(Object.values(attributesName)[3]);
                                                            setIsParent(Object.values(attributesName)[2]);
                                                            setIsOptional(attributesName.is_optional)
                                                            handleClickEditAndDeleteMenu(event)
                                                        }
                                                    }
                                                >
                                                    <MoreVertIcon color='Black' />
                                                </IconButton>
                                                <IconButton
                                                    aria-label="more"
                                                    id="demo-positioned-menu"
                                                    aria-controls={openEditAndDeleteMenu ? 'demo-positioned-menu' : undefined}
                                                    aria-expanded={openEditAndDeleteMenu ? 'true' : undefined}
                                                    aria-haspopup="true"
                                                    onClick={
                                                        (event) => {
                                                            let indexs = [...selectedIndexs];
                                                            if (selectedIndexs[index] == false) {
                                                                indexs[index] = true;
                                                                isClickedMoreIcon = true
                                                                setSubMenu("")
                                                            } else {
                                                                indexs[index] = false;
                                                                indexs.map((i, index1) => {
                                                                    if (index != index1) {
                                                                        indexs[index1] = true;
                                                                    }
                                                                })
                                                            }
                                                            setSelectedIndexs(indexs)
                                                            setTrigger(trigger + 1);
                                                            setIsVariant(Object.values(attributesName)[3]);
                                                            setIsParent(Object.values(attributesName)[2]);
                                                            setIsOptional(attributesName.is_optional)

                                                        }
                                                    }
                                                >

                                                    {selectedIndexs[index] == undefined || selectedIndexs[index] ? <NavigateNextIcon color='Black' />
                                                        :
                                                        <KeyboardArrowLeftIcon color='Black' />

                                                    }
                                                </IconButton>
                                            </Grid>
                                        </MenuItem>
                                    )


                                })}
                                <Menu
                                    id="demo-positioned-menu"
                                    aria-labelledby="demo-positioned-button"
                                    anchorEl={anchorEl}
                                    open={openEditAndDeleteMenu}
                                    onClose={handleCloseEditAndDeleteMenu}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                >
                                    <MenuItem onClick={() => clickEditAttribute(selectedRow)}>Edit</MenuItem>
                                    <MenuItem onClick={handleClickDelete}>Delete</MenuItem>
                                </Menu>
                            </MenuList>


                        </Paper>

                        <Paper elevation={5} sx={{ width: "100%", minHeight: "100", marginTop: '-9px', borderTop: 'solid 1px rgba(0, 0, 0, 0.12)' }} >
                            {attributesList.length != 0 && (((attributesList.length / 20).toString().split('.')[1])) != undefined ?

                                <Grid item xs={12} mt={2} ml={1} pb={2}>
                                    <Pagination
                                        count={Math.ceil(attributesList.length / 20)}
                                        color="P"
                                        page={currentPage}
                                        onChange={handleChange}
                                        sx={{
                                            '& .MuiPaginationItem-root': {
                                                '&.Mui-selected': {
                                                    color: 'white',
                                                },
                                            }
                                        }}
                                    />
                                </Grid>
                                : <Grid item xs={12} mt={2} ml={1} pb={2}>
                                    <Pagination
                                        count={Math.floor(attributesList.length / 20)}
                                        color="P"
                                        page={currentPage}
                                        sx={{ outlineColor: 'White.main' }}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            }
                        </Paper>
                    </Grid>
                    <Grid item xs={5} sx={{ width: "100%", height: subMenu == '' ? 0 : getHeight() }} mt={subMenu == '' ? getMargin() : 2.3} p={0} display='flex' flexDirection='column' >
                        {subMenu}
                        {subType}
                        {!isHidden &&
                            (<Grid item xs={5} sx={{ width: "100%", overflow: 'hidden' }} mt={2.3} p={0} textAlign='end'>
                                <Grid
                                    elevation={5}
                                    sx={{
                                        width: "33vw",
                                        minHeight: 200,
                                        maxHeight: 400,
                                        position: "fixed",
                                    }}
                                >
                                    <Grid sx={{ width: "100%" }} disablePadding>
                                        <Fab onClickCapture={() => { setOpenAtt(true); localStorage.setItem("isClickedAttribute", true) }} color="P.main" aria-label="add" onClick={handleClickOpenDialogAtt} sx={{ backgroundColor: "P.main", '&:hover': { backgroundColor: 'P.main' } }} >
                                            <AddIcon color="White" sx={{ fill: 'P.main' }} />
                                        </Fab>
                                    </Grid>
                                </Grid>

                            </Grid>
                            )
                        }
                    </Grid>


                    <Dialog
                        maxWidth={window.innerWidth < 1150 ? (window.innerWidth < 700 ? 'lg' : 'md') : 'sm'}
                        open={openAtt == "true" || openAtt == true ? true : false}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <Grid item xs={12} display='flex' justifyContent='start' m={2}>
                            <Typography variant="menutitle" color="Black.main" >
                                {isEdit ? 'Edit Attribute' : 'Add Attribute'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} display='flex' flexWrap='wrap'>
                            {languages.map((lan, index) => {
                                return (
                                    <Grid item xs={6} p={2}>
                                        <TextField
                                            id="outlined-basic"
                                            label={"Attribute " + lan.title.charAt(0).toUpperCase() + lan.title.slice(1) + " Name"}
                                            color="P"
                                            defaultValue={isEdit && selectedRow.translated.title[index] ? selectedRow.translated.title[index].value : ''}
                                            fullWidth
                                            disabled={!editFlag || isEdit}
                                            onChange={(e) => {
                                                newAttName[lan.id] = {
                                                    "language_id": lan.id,
                                                    "value": e.target.value
                                                }
                                                refreshAttributesList(false);
                                            }}
                                        />
                                    </Grid>
                                )
                            })}

                            <Grid item xs={6} p={2}>
                                <TextField
                                    id="outlined-basic"
                                    label="Attribute System Name"
                                    color="P"
                                    defaultValue={isEdit ? selectedRow.label : ''}
                                    fullWidth
                                    disabled={!editFlag || isEdit}
                                    error={disabledSave}
                                    helperText={disabledSave ? newLable[1].value + ' is already declared' : ''}
                                    onChange={(e) => {
                                        const test = 1;
                                        setOnchangeOff(true)
                                        setDisabledSave(false)
                                        for (let i = 0; i < attributesList.length; i++) {
                                            if (isEdit) {
                                                if (selectedRow.label === e.target.value) {
                                                    setDisabledSave(false)
                                                    break;
                                                }
                                            }
                                            if (attributesList[i].label === e.target.value) {
                                                setDisabledSave(true);
                                            }
                                        }
                                        attributesList.forEach(attribute => {

                                        });
                                        const lable = []
                                        lable[1] =
                                        {
                                            language_id: test,
                                            value: e.target.value
                                        }
                                        lable[2] = {
                                            language_id: test + 1,
                                            value: ''
                                        }

                                        setNewLable(lable)
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} p={2}>
                                <FormControl fullWidth disabled={!editFlag || isEdit}>
                                    <InputLabel id="Type Attribute" color="P">
                                        Type Attribute
                                    </InputLabel>
                                    <Select
                                        IconComponent={KeyboardArrowDownIcon}
                                        labelId="Type Attribute"
                                        id="demo-simple-select-required"
                                        color="P"
                                        label="Type Attribute"
                                        value={fieldType}
                                        defaultValue={isEdit ? selectedRow.type : ''}
                                        onChange={(e) => {
                                            setFieldType(e.target.value)
                                        }}
                                    >
                                        <MenuItem value={1}>Drop Down</MenuItem>
                                        <MenuItem value={2} >Text Field</MenuItem>
                                        <MenuItem value={3} >Text Area</MenuItem>
                                        <MenuItem value={4} >Switch</MenuItem>



                                    </Select>
                                </FormControl>
                            </Grid>

                        </Grid>
                        <Grid item xs={12} p={2} flexWrap='wrap' style={{ borderTop: 'solid 1px rgba(0, 0, 0, 0.12)', borderBottom: 'solid 1px rgba(0, 0, 0, 0.12)' }}>
                            <Grid container xs={12} sx={{ display: "flex", justifyContent: "start", alignItems: "center" }} >
                                <Grid item xs={6} sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
                                    <Typography variant="h2" color="Black.main" mr={2}>
                                        Main Attribute
                                    </Typography>
                                    <AntSwitch
                                        color="P"
                                        disabled={!editFlag}
                                        defaultChecked={isEdit ? isParent : ''}
                                        checked={isEdit ? isParent : isParent}
                                        onChange={(e, val) => {
                                            setIsParent(val)
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6} pl={2} sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
                                    <Typography variant="h2" color="Black.main" mr={2}>
                                        Variant Attribute
                                    </Typography>
                                    {selectedRow &&
                                        <AntSwitch
                                            color="P"
                                            disabled={!editFlag || isParent}
                                            defaultChecked={isEdit ? isVariant : ''}
                                            checked={isParent ? true : isVariant}
                                            onChange={(e, val) => {
                                                setIsVariant(val);
                                            }}
                                        />
                                    }

                                </Grid>
                            </Grid>

                            <Typography variant="h10" color="G1.main">
                                If you dont enable these two options, this attribute will be added to the General Information
                            </Typography>


                            {fieldType && fieldType !== 4 ?
                                <Grid xs={12}>
                                    <Grid item xs={12} mt={2} sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
                                        <Typography variant="h2" color="Black.main" pr={1}>
                                            Compulsory
                                        </Typography>
                                        <Grid>
                                            <AntSwitch
                                                color="P"
                                                disabled={!editFlag}
                                                defaultChecked={isEdit ? isOptional : ''}
                                                checked={isEdit ? (isOptional) : (isOptional)}
                                                onChange={(e, val) => {
                                                    setIsOptional(val)
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Typography mb={2} variant="h10" color="G1.main">
                                        By enabling this option, this attribute will be required and will not have a None value in the attribute values list.
                                    </Typography>
                                    <Divider />
                                </Grid>
                                :
                                ''
                            }


                            {fieldType !== 1 ? '' : isEdit && selectedRow.type === 1 ?
                                <>
                                    {(isEdit ? newValue : countAttribute).length > 0 ?
                                        (isEdit ? newValue : new Array(countAttribute)
                                            .fill("", 0, countAttribute)).map((row, index) => {
                                                return (
                                                    <Grid item display='flex' xs={12} flexWrap='wrap'>
                                                        {(languages).map((lan, id) => {
                                                            return id == 0 ? (
                                                                <Grid item xs={5.2} p={2} ml={18}>
                                                                    {!isEdit ? '' : newValue[index] &&
                                                                        <TextField
                                                                            id="outlined-basic"
                                                                            label={'Value' + (index + 1) + " " + lan.title.charAt(0).toUpperCase() + lan.title.slice(1)}
                                                                            color="P"
                                                                            fullWidtherror={!isUniqe && selectedIndex == index}
                                                                            helperText={(!isUniqe && selectedIndex == index) ? unUniqeValue + ' is already declared' : ''}
                                                                            value={isEdit ? newValue[index].value.filter(v => v.language_id === lan.id)[0] ? newValue[index].value.filter(v => v.language_id === lan.id)[0]['value'] : '' : ''}
                                                                            onChange={(e) => {
                                                                                addNewValue(e, index, lan.id)
                                                                            }}
                                                                        />
                                                                    }
                                                                </Grid>
                                                            ) : ""
                                                        })}
                                                        <IconButton aria-label="delete" color="G2" sx={{ width: 50, height: 50, marginTop: 2.5 }}
                                                            onClick={() => clickRemoveAttribute(index)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Grid>)
                                            })
                                        : ''}
                                </>
                                : fieldType !== 1 ? '' : (new Array(countAttribute)
                                    .fill("", 0, countAttribute)).map((value, index) => {
                                        return (
                                            <Grid item display='flex' xs={12} flexWrap='wrap'>

                                                {(languages).map((lan, id) => {
                                                    return id == 0 ? (
                                                        <Grid item xs={5.2} p={2} ml={18}>
                                                            <TextField
                                                                id="outlined-basic"
                                                                label={'Value' + (index + 1) + " " + lan.title.charAt(0).toUpperCase() + lan.title.slice(1)}
                                                                color="P"
                                                                fullWidth
                                                                error={!isUniqe && selectedIndex == index}
                                                                helperText={(!isUniqe && selectedIndex == index) ? unUniqeValue + ' is already declared' : ''}
                                                                value={newValue[index] != undefined ? (newValue[index].value[id] != undefined ? newValue[index].value[id].value : '') : ''}
                                                                onChange={(e) => {
                                                                    addNewValue(e, index, lan.id)
                                                                }}
                                                            />
                                                        </Grid>
                                                    ) : ""
                                                })}
                                                {!isEdit ?
                                                    <IconButton aria-label="delete" color="G2" sx={{ width: 50, height: 50, marginTop: 2.5 }}
                                                        onClick={() => clickRemoveAttribute(index)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    :
                                                    ''
                                                }

                                            </Grid>
                                        )
                                    })
                            }
                            {fieldType !== 1 ? '' :
                                <Grid item xs={12} display='flex' pl={1} >
                                    <Button
                                        color="P"
                                        startIcon={<AddIcon />}
                                        onClick={clickAddAttribute}
                                    >
                                        Add Value To Dropdown
                                    </Button>

                                </Grid>
                            }
                        </Grid>
                        {
                            hasImage ?
                                <Grid item xs={12} p={2} display='flex' justifyContent='start'>
                                    <Uploader imageId={fileId => setFileId(fileId)} />
                                    <h1>{fileId}</h1>
                                </Grid>
                                :
                                ''
                        }

                        <Grid
                            item
                            xs={12}
                            paddingLeft={1}
                            paddingRight={1}
                            display="flex"
                            justifyContent="end"

                        >
                            <Divider />
                            <Button
                                variant="outlined"
                                color="G1"
                                onClick={handleCloseDialogAtt}
                                sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
                            >
                                Cancel
                            </Button>
                            {
                                (!disabledSave) && (
                                    <Button
                                        variant="contained"
                                        color="P"
                                        sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "white" }}
                                        onClick={isEdit ? editAttribute : addNewAttributes}
                                    >
                                        save
                                    </Button>
                                )
                            }

                            {
                                disabledSave && (
                                    <CircularProgress sx={{ mt: 2, width: 10, mr: 1 }} />
                                )
                            }
                        </Grid>
                    </Dialog>
                    <Dialog
                        maxWidth='md'
                        fullWidth
                        open={openEdit}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <Grid item xs={12} display='flex' justifyContent='start' m={2}>
                            <Typography variant="menutitle" color="Black.main" >
                                Add Attribute
                            </Typography>
                        </Grid>
                        <Grid item xs={12} display='flex' flexWrap='wrap'>


                            <Grid item xs={6} p={2}>
                                <TextField
                                    id="outlined-basic"
                                    label={"Attribute Name"}
                                    color="P"
                                    defaultValue={attributeName}
                                    fullWidth
                                    onChange={(e) => {
                                        setAttributeName(e.target.value)
                                    }}
                                />
                            </Grid>



                            <Grid item xs={6} p={2}>
                                <TextField
                                    id="outlined-basic"
                                    label="Attribute System Name"
                                    color="P"
                                    defaultValue={attributeSystemName}
                                    fullWidth
                                    onChange={(e) => {
                                        setAttributeSystemName(e.target.value)
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} p={2}>
                                <FormControl fullWidth disabled={!editFlag}>
                                    <InputLabel id="Type Attribute" color="P">
                                        Type Attribute
                                    </InputLabel>
                                    <Select
                                        IconComponent={KeyboardArrowDownIcon}
                                        labelId="Type Attribute"
                                        id="demo-simple-select-required"
                                        color="P"
                                        label="Type Attribute"
                                        value={fieldType}
                                        defaultValue={isEdit ? selectedRow.type : ''}
                                        onChange={(e) => {
                                            setFieldType(e.target.value)
                                        }}
                                    >
                                        <MenuItem value={1}>Drop Down</MenuItem>
                                        <MenuItem value={2} >Text Field</MenuItem>
                                        <MenuItem value={3} >Text Area</MenuItem>
                                        <MenuItem value={4} >Switch</MenuItem>



                                    </Select>
                                </FormControl>
                            </Grid>

                        </Grid>
                        <Grid item xs={12} display='flex' flexWrap='wrap'>
                            {fieldType !== 1 ? '' :
                                <Grid item xs={12} p={2} display='flex' justifyContent='space-between'>
                                    <Typography variant="h2" color="Black.main">
                                        Is this a variant?
                                    </Typography>


                                    {selectedRow &&

                                        <AntSwitch

                                            disabled={!editFlag}
                                            defaultChecked={isEdit ? isVariant : ''}
                                            checked={isEdit ? isVariant : isVariant}
                                            onChange={(e, val) => {
                                                setIsVariant(val);
                                            }}
                                        />
                                    }

                                </Grid>
                            }
                            {fieldType !== 1 ? '' :
                                <Grid item xs={12} p={2} display='flex' justifyContent='space-between'>
                                    <Typography variant="h2" color="Black.main">
                                        Is this the main variant?
                                    </Typography>
                                    <AntSwitch
                                        disabled={!editFlag}
                                        defaultChecked={isEdit ? isParent : ''}
                                        checked={isEdit ? isParent : isParent}
                                        onChange={(e, val) => {
                                            setIsParent(val)
                                        }}
                                    />
                                </Grid>
                            }
                            {isEdit && selectedRow.type === 1 ?
                                <>
                                    <Grid xs={12} display='flex'>
                                        <Grid xs={6}>
                                            {selectedRow.translated.values && selectedRow.translated.values.filter((v) => v.language_id === 1).map((value, index) => {
                                                return (
                                                    <Grid item xs={12} p={2}>
                                                        <TextField
                                                            id="outlined-basic"
                                                            label={'English Value' + (index + 1)}
                                                            color="P"
                                                            fullWidth
                                                            defaultValue={value.value}
                                                            disabled={!editFlag}
                                                            onChange={(e) => {
                                                                addNewValue(e, index, value.language_id)
                                                            }}
                                                        />
                                                    </Grid>
                                                )
                                            })}
                                        </Grid>
                                        <Grid xs={6}>
                                            {selectedRow.translated.values && selectedRow.translated.values.filter((v) => v.language_id !== 1).map((value, index) => {
                                                return (
                                                    <Grid item xs={12} p={2}>
                                                        <TextField
                                                            id="outlined-basic"
                                                            label={'Arabic Value' + (index + 1)}
                                                            color="P"
                                                            fullWidth
                                                            defaultValue={value.value}
                                                            disabled={!editFlag}
                                                            onChange={(e) => {
                                                                addNewValue(e, index, value.language_id)
                                                            }}
                                                        />
                                                    </Grid>
                                                )

                                            })}
                                        </Grid>

                                    </Grid>
                                    {countAttribute.length > 0 ?
                                        (new Array(countAttribute)
                                            .fill("", 0, countAttribute)).map((row, index) => {
                                                return (
                                                    <Grid item display='flex' xs={12} flexWrap='wrap'>
                                                        inja hast
                                                        {(languages).map((lan, id) => {
                                                            return (
                                                                <Grid item xs={5.6} p={2}>
                                                                    <TextField
                                                                        id="outlined-basic"
                                                                        label={'Value' + (index + 1) + " " + lan.title.charAt(0).toUpperCase() + lan.title.slice(1)}
                                                                        color="P"
                                                                        fullWidth
                                                                        onChange={(e) => {
                                                                            addNewValue(e, index, lan.id)
                                                                        }}
                                                                    />
                                                                </Grid>
                                                            )
                                                        })}
                                                        <IconButton aria-label="delete" color="G2"
                                                            onClick={() => clickRemoveAttribute(index)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Grid>)
                                            })
                                        : ''}
                                </>
                                : fieldType !== 1 ? '' : (new Array(countAttribute)
                                    .fill("", 0, countAttribute)).map((value, index) => {
                                        return (
                                            <Grid item display='flex' xs={12} flexWrap='wrap'>
                                                injast
                                                {(languages).map((lan, id) => {
                                                    return (
                                                        <Grid item xs={5.6} p={2}>
                                                            <TextField
                                                                id="outlined-basic"
                                                                label={'Value' + (index + 1) + " " + lan.title.charAt(0).toUpperCase() + lan.title.slice(1)}
                                                                color="P"
                                                                fullWidth
                                                                onChange={(e) => {
                                                                    addNewValue(e, index, lan.id)
                                                                }}
                                                            />
                                                        </Grid>
                                                    )
                                                })}
                                                {!isEdit ?
                                                    <IconButton aria-label="delete" color="G2"
                                                        onClick={() => clickRemoveAttribute(index)}
                                                    >
                                                        <DeleteIcon />2
                                                    </IconButton>
                                                    :
                                                    ''
                                                }

                                            </Grid>
                                        )
                                    })
                            }

                        </Grid>
                        {
                            hasImage ?
                                <Grid item xs={12} p={2} display='flex' justifyContent='start'>
                                    <Uploader imageId={fileId => setFileId(fileId)} />
                                    <h1>{fileId}</h1>
                                </Grid>
                                :
                                ''
                        }


                        {fieldType !== 1 ? '' :

                            <Grid item xs={12} display='flex' flexWrap='wrap' justifyContent='space-between'>

                                <Divider sx={{ width: "100%", height: "2%" }} />
                                <Grid item xs={5.5} display='flex' justifyContent='space-between' textAlign="center" alignItems="center">
                                    <Typography variant="h2" color="Black.main" paddingLeft="12%">
                                        Add an extension?
                                    </Typography>
                                    <AntSwitch
                                        disabled={!editFlag}
                                        defaultChecked={isEdit ? isParent : ''}
                                        checked={isEdit ? isParent : isParent}
                                        onChange={(e, val) => {
                                            setIsParent(val)
                                        }}
                                    />
                                </Grid>



                                <Grid item xs={6} p={2} pr={0} pl={5}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Extemsion"
                                        color="P"
                                        defaultValue={attributeSystemName}
                                        fullWidth
                                    />
                                </Grid>
                                <Divider sx={{ width: "100%", height: "2%" }} />
                                <Grid item xs={6} p={2}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Value"
                                        color="P"
                                        defaultValue={attributeSystemName}
                                        fullWidth
                                    />
                                </Grid>
                                {fieldType !== 1 ? '' :
                                    <Grid item xs={12} display='flex' pl={1} >
                                        <Button
                                            color="P"
                                            startIcon={<AddIcon />}
                                            onClick={clickAddAttribute}
                                        >
                                            Add Valid Values
                                        </Button>

                                    </Grid>
                                }
                                <Divider sx={{ width: "100%", height: "2%" }} />
                            </Grid>
                        }



                        <Grid
                            item
                            xs={12}
                            paddingLeft={1}
                            paddingRight={1}
                            display="flex"
                            justifyContent="end"
                        >
                            <Divider />
                            <Button
                                variant="outlined"
                                color="G1"
                                onClick={handleCloseDialogAtt}
                                sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="P"
                                sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "White.main" }}
                                onClick={() => setOpenEdit(false)}
                            >
                                save
                            </Button>
                        </Grid>
                    </Dialog>
                    <Dialog
                        open={openType}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <Grid item xs={12} display='flex' justifyContent='start' m={2}>
                            <Typography variant="menutitle" color="black">
                                Add Type
                            </Typography>
                        </Grid>
                        <Grid item xs={12} display='flex' justifyContent='center' style={{ width: '779px' }}>
                            <Grid item xs={6} p={2}>
                                <TextField
                                    id="outlined-basic"
                                    label="Title"
                                    color="P"
                                    fullWidth
                                    onChange={(e) => {
                                        setNewTypeName({ 'title': e.target.value });
                                    }}
                                />
                            </Grid>

                            <Grid item xs={6} p={2}>
                                <TextField
                                    id="outlined-basic"
                                    label="Slug"
                                    color="P"
                                    fullWidth
                                    onChange={(e) => {
                                        setNewTypeName({ 'title': e.target.value });
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} p={2} >
                            <TextField
                                id="outlined-basic"
                                label="Keyword"
                                multiline
                                rows={3}
                                color="P"
                                fullWidth
                                onChange={(e) => {
                                    setNewTypeName({ 'title': e.target.value });
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} m={2} display='grid'>
                            <label htmlFor="contained-button-file">
                                <Input
                                    accept="image/*"
                                    id="contained-button-file"
                                    multiple
                                    type="file"
                                />
                                <Button
                                    variant="contained"
                                    component="span"
                                    className="uploadBtn"
                                    size="small"
                                >
                                    <AddIcon />
                                    Add Pic or Video
                                </Button>
                            </label>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            paddingLeft={1}
                            paddingRight={1}
                            display="flex"
                            justifyContent="end"
                        >
                            <Divider />
                            <Button
                                variant="outlined"
                                color="G1"
                                onClick={handleCloseDialogType}
                                sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="P"
                                sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "White.main" }}
                                disabled={newTypeName == ''}
                                onClick={addNewType}
                            >
                                save
                            </Button>
                        </Grid>
                    </Dialog>
                    <Dialog
                        open={openDelete}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <Grid xs={12} display='flex' justifyContent='center' mt={3} mb={1} ml={3} mr={6}>
                            <Typography>
                                Are you sure you want to delete {selectedRow.label}?
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
                                sx={{ mt: 2, mb: 2, mr: 1, ml: 1, color: "White.main" }}
                                onClick={clickDeleteAttribute}
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
                    <Dialog
                        open={openDeleteError}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <Grid xs={12} display='flex' justifyContent='center' mt={3} mb={1} ml={3} mr={6}>
                            <ErrorIcon color='error' />
                            <Typography pl={1}>
                                {selectedRow.label} cannot be deleted while it’s used in the category !!!
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
                                variant="outlined"
                                color="G1"
                                onClick={() => {
                                    setOpenDeleteError(false);
                                    setAnchorEl(null);
                                }}
                                sx={{ mt: 2, mb: 2, mr: 1, ml: 1 }}
                            >
                                Close
                            </Button>
                        </Grid>
                    </Dialog>
                    <Snackbar
                        open={showSuccessMessage.open}
                        autoHideDuration={5000}
                        onClose={() => {
                            setShowSuccessMessage(false)
                        }}
                    >
                        <Alert onClose={() => setShowSuccessMessage(false)} severity="success" sx={{ width: '100%' }}>
                            {showSuccessMessage.message}
                        </Alert>
                    </Snackbar>
                </Grid>

            }

        </AdminLayout>
    );
};

export default AddAttributes;
