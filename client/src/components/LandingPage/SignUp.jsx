import React, { useState, useEffect,useRef } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  useMediaQuery,
  Typography,
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Avatar,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
} from "@mui/material";
import background from "../../assets/images/back_landing.jpg";
import { useTheme } from "@mui/material/styles";
import {
  isValidEmail,
  isValidPassword,
  isValidFirstName,
  isValidLastName,
  isMinimumAge,
  isValidNickName,
} from "./validations";
import SelectLabels from "./DevOption";
import toast, { Toaster } from "react-hot-toast";
import AvatarSelection from "./AvatarSelection";
import { avatars } from "./avatars";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import title from "../../assets/images/title.png";
import { useProductsStore } from "../../store/productsStore";


export default function SignUp() {
  const [formVisible, setFormVisible] = useState(false);
  const theme = useTheme();
  const [selectedRole, setSelectedRole] = useState("User");
  const navigate = useNavigate();
  const { isLogged, authenticate } = useAuthStore();

  const cloudinaryRef = useRef()
  const widgetRef = useRef()
  const {deleteImage} = useProductsStore()

  const [imageUrl, setImageUrl] = useState();
  const [selectedImage, setSelectedImage] = useState()

      cloudinaryRef.current = window.cloudinary
      widgetRef.current = cloudinaryRef.current.createUploadWidget({
          cloudName:"healtech", //nuestra nube
          uploadPreset: "otiod5ve", //preselector de subidas (incluye info de como se sube)
          folder: 'healtech/products', //folder products en el cual se subne las imagenes
          singleUploadAutoClose: false,
          multiple: false, //permite solo subir un archivo
          maxImageFileSize: 2000000, //peso maximo: 2 megas,
          maxImageWidth: 2000, //reescala la imagen a 2000px , si es muy grande
          cropping: true, //le permite recortar la imagen de ser necesario
          clientAllowedFormats: ["jpg",'png','jpeg'],
      },function(err,res){
      if (!err && res && res.event === "success") {
          if(selectedImage){
              deleteImage(selectedImage)
          }
          setSelectedImage(res.info.public_id)
          setImageUrl(res.info.url)
          setFormData({
              ...formData,
              image: imageUrl,
              })
      } 
  })

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthday: "",
    nickName: "",
    image:""
  });

  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    birthday: false,
    nickName: false,
  });

  const [isDeveloper, setIsDeveloper] = useState("Yes");
  const [developerType, setDeveloperType] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");

  useEffect(() => {
    if (isDeveloper === "No") setDeveloperType("");
  }, [isDeveloper, developerType]);

  const handleIsDeveloperChange = (value) => {
    setIsDeveloper(value);
  };

  const handleDeveloperTypeChange = (value) => {
    setDeveloperType(value);
  };

  const handleAvatarChange = (value) => {
    setSelectedAvatar(value);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const newValue = value;

    setFormData({
      ...formData,
      [name]: newValue,
    });

    switch (name) {
      case "firstName":
        setFormErrors({
          ...formErrors,
          firstName: !isValidFirstName(newValue),
        });
        break;
      case "nickName":
        setFormErrors({
          ...formErrors,
          nickName: !isValidNickName(newValue),
        });
        break;
      case "lastName":
        setFormErrors({
          ...formErrors,
          lastName: !isValidLastName(newValue),
        });
        break;
      case "email":
        setFormErrors({
          ...formErrors,
          email: !isValidEmail(newValue),
        });
        break;
      case "password":
        setFormErrors({
          ...formErrors,
          password: !isValidPassword(newValue),
        });
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isValidFirstName(formData.firstName)) {
      setFormErrors({ ...formErrors, firstName: true });
      return;
    }

    if (!isValidLastName(formData.lastName)) {
      setFormErrors({ ...formErrors, lastName: true });
      return;
    }

    if (!isValidEmail(formData.email)) {
      setFormErrors({ ...formErrors, email: true });
      return;
    }

    if (!isValidPassword(formData.password)) {
      setFormErrors({ ...formErrors, password: true });
      return;
    }

    if (!isMinimumAge(formData.birthday)) {
      return toast.error("You must be at least 12 years old to register.");
    }

    if (isDeveloper === "Yes" && developerType === "") {
      return toast.error("Choose a team of developers");
    }

    if (!selectedAvatar) {
      return toast.error("Choose a avatar");
    }

    if (!isValidNickName(formData.nickName)) {
      setFormErrors({ ...formErrors, nickName: true });
      return;
    }
    try {
      const dataToSend = {
        username: formData.nickName,
        first_name: formData.firstName,
        last_name: formData.lastName,
        password: formData.password,
        birth_date: formData.birthday,
        email: formData.email,
        avatar: selectedAvatar,
        role: selectedRole,
        team: developerType,
      };

      await axios.post("/postUser", dataToSend);
      toast.success("User created successfully!");

      try {
        await authenticate({
          email: formData.email,
          password: formData.password,
        });
        console.log(isLogged);
      } catch (error) {
        console.error("Error:", error.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleAuthentication = () => {
    if (isLogged) {
      navigate("/home");
    }
  };

  useEffect(() => {
    if (isLogged) {
      handleAuthentication();
    }
  }, [isLogged]);

  useEffect(() => {
    setTimeout(() => {
      setFormVisible(true);
    }, 200);
  }, []);

  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <img
        src={title}
        style={{
          display: isDesktop ? "flex" : "none",
          position: "absolute",
          maxWidth: isDesktop ? "50vh" : "40vh",
          top: "10%",
          left: !isDesktop ? "50%" : "15%",
          transform: "translate(-50%, -50%)",
        }}
      />{" "}
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
        sx={{
          backgroundColor: theme.palette.background.main,
        }}
      >
        <Box
          sx={{
            my: 0,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: formVisible ? "translateY(0)" : "translateY(-100%)",
            transition: "transform 0.5s ease-in-out",
          }}
        >
          {/* <div style={{ display: isDesktop ? "flex" : "none" }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              sx={{
                color: "white",
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.h2,
              }}
            >
              Sign up
            </Typography>
          </div> */}
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{
              backgroundColor: theme.palette.background_ligth.main,
              padding: 4,
              borderRadius: 6,
              marginTop: 4,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={formErrors.firstName}
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id={
                    formErrors.firstName
                      ? "outlined-error-helper-text"
                      : "firstName"
                  }
                  label={formErrors.firstName ? "Error" : "First Name"}
                  value={formData.firstName}
                  onChange={handleChange}
                  helperText={formErrors.firstName ? "Invalid first name" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id={
                    formErrors.lastName
                      ? "outlined-error-helper-text"
                      : "lastName"
                  }
                  label={formErrors.lastName ? "Error" : "Last Name"}
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={formErrors.lastName}
                  helperText={formErrors.lastName ? "Invalid last name" : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={formErrors.email}
                  onChange={handleChange}
                  margin="normal"
                  required
                  fullWidth
                  id={formErrors.email ? "outlined-error-helper-text" : "email"}
                  label={formErrors.email ? "Error" : "Email Address"}
                  name="email"
                  autoComplete="email"
                  helperText={formErrors.email ? "Invalid email format" : ""}
                  value={formData.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label={formErrors.password ? "Error" : "Password"}
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={formErrors.password}
                  helperText={
                    formErrors.password
                      ? "Password must be at least 8 characters, including an uppercase letter and a number"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="date"
                  label="Birthday"
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} mt={1}>
                <SelectLabels
                  isDesktop={isDesktop}
                  isDeveloper={isDeveloper}
                  developerType={developerType}
                  onIsDeveloperChange={handleIsDeveloperChange}
                  onDeveloperTypeChange={handleDeveloperTypeChange}
                />
              </Grid>
              <Grid
                item
                xs={12}
                style={{
                  display: "flex",
                  flexDirection: isDesktop ? "row" : "column",
                  justifyContent: "space-between",
                }}
              >
              </Grid >
              <Grid item xs={12} sm={6}>
                <AvatarSelection
                  isDesktop={isDesktop}
                  avatars={avatars}
                  onChange={handleAvatarChange}
                />            
              </Grid>
              {/* <Grid item xs={12} sm={6} l={12}>
                    <Button variant="contained" color="primary" component="span" textAlign="center" onClick={() => widgetRef.current.open()}>
                    Upload Image
                    </Button>   
                {imageUrl && (
                  <Box mt={1} textAlign="center">
                  <img src={imageUrl} alt={imageUrl} width={200}/>
                    </Box>)}
              </Grid> */}
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel id="demo-controlled-radio-buttons-group">
                    Role
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={selectedRole}
                    onChange={handleRoleChange}
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <FormControlLabel
                      value="User"
                      control={<Radio />}
                      label="User"
                    />
                    <FormControlLabel
                      value="Trainer"
                      control={<Radio />}
                      label="Trainer"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
              </Grid>
              <Link href="/" variant="body2" style={{ marginLeft: "auto" }}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Box>
        </Box>
      </Grid>
      <Toaster position="top-center" reverseOrder={false} />
    </Grid>
  );
}