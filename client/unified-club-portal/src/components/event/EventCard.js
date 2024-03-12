import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Chip from "@material-ui/core/Chip";
import Hidden from "@material-ui/core/Hidden";
import { getEventStatus } from "../../services/eventServices";

const useStyles = makeStyles({
  card: {
    display: "flex",
    border: "1px solid #ddd",
    margin: "10px 5px",
    boxShadow: "none",
  },
  cardDetails: {
    flex: 1,
    display: "flex",
    textAlign: "left",
    justifyContent: "flex-start",
  },
  cardMedia: {
    width: 250,
  },
  cardAction: {
    "&hover": {
      backgroundColor: "transparent",
    },
  },
  chip_start: {
    backgroundColor: "green",
    marginBottom: "10px",
  },
  chip_end: {
    backgroundColor: "red",
    marginBottom: "10px",
  },
});

export default function FeaturedPost(props) {
  const classes = useStyles();
  const { event } = props;
  const { name, desc, capacity, from, to } = event;
  const status = getEventStatus(from, to);
  var statusText = "UPCOMING",
    statusClass = status === 2 ? classes.chip_end : classes.chip_start;

  if (status === 1) statusText = "ON-GOING";
  else if (status === 2) statusText = "ENDED";
  const startDate = new Date(from);
  const startDateString = `${startDate.getDate()}/${startDate.getMonth()}/${startDate.getFullYear()} ${startDate.getHours()}:${startDate.getMinutes()}`;

  const toDate = new Date(to);
  const toDateString = `${toDate.getDate()}/${toDate.getMonth()}/${toDate.getFullYear()} ${toDate.getHours()}:${toDate.getMinutes()} `;

  return (
    <Card className={classes.card}>
      <div className={classes.cardDetails}>
        <CardContent>
          <Typography component='h2' variant='h5'>
            {name}
          </Typography>
          <Typography variant='subtitle1' color='textSecondary'>
            {startDateString} to {toDateString}
          </Typography>
          <Typography variant='subtitle1' paragraph>
            {desc}
            <br />
            Capacity: {capacity}
          </Typography>
          <Chip
            color='secondary'
            size='small'
            label={statusText}
            className={statusClass}
          />
        </CardContent>
      </div>
      <Hidden xsDown>
        <CardMedia
          className={classes.cardMedia}
          image='https://d1csarkz8obe9u.cloudfront.net/posterpreviews/zoom-background%2C-event%2Cpresentation-design-template-69f11bda0c4d7c9ccb155035a05493d9_screen.jpg?ts=1598358685'
          title={name}
        />
      </Hidden>
    </Card>
  );
}

FeaturedPost.propTypes = {
  post: PropTypes.object,
};
