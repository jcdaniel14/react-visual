import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from '@mui/icons-material/Error';


import { Component } from "react";

class ErrorDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open,
    };
  }

  render() {
    return (
      <div>
        <BootstrapDialog
          onClose={this.props.closeError}
          aria-labelledby="customized-dialog-title"
          open={this.props.open}
        >
          <BootstrapDialogTitle id="customized-dialog-title" onClose={this.props.closeError}>
            <div style={{display: "flex", alignItems:"center" }}>
              <ErrorIcon sx={{fontSize:"1.75rem", color: "#FFC400"}}/>
              <div style={{fontFamily: "Quicksand Bold", marginLeft: "1rem"}}>{this.props.title}</div>
            </div>
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <div style={{minWidth: "20rem", maxWidth:"30rem", wordBreak:"break-word",whiteSpace:"pre-wrap", fontFamily: "Quicksand", padding:"1rem 2rem"}}>{this.props.msg}</div>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={this.props.closeError}>
              <div style={{fontFamily: "Quicksand Bold"}}>Close</div>
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </div>
    );
  }
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
export default ErrorDialog;
