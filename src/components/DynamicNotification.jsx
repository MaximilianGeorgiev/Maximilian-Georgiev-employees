import { Typography } from "@mui/material";

const DynamicNotification = ({ variant, message }) => {
    return (
        <Typography variant={variant}>{message}</Typography>
    );
};

export default DynamicNotification;