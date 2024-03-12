import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { fetchClubList } from "../services/clubServices";
import ClubCard from "../components/club/ClubCard";
import MessageComponent from "../components/MessageComponent";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      flexGrow: 1,
      display: "flex",
      justifyContent: "center",
    },
    control: {
      padding: theme.spacing(2),
    },
    grid_card: {
      padding: "10px",
    },
  })
);

export default function ClubGrid() {
  const [clubList, setClubList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagePopupState, setMessagePopupState] = useState(false);
  const [message, setMessage] = useState("");

  const styles = useStyles();

  useEffect(() => {
    async function getClublist() {
      const response = await fetchClubList();
      if (response.status === 200) {
        setClubList(response.data.data);
      } else if (response.status === 500) {
        console.log(response.data.errors);
        setMessage("Internal Server Error");
        setMessagePopupState(true);
      }
      setLoading(false);
    }
    getClublist();
  }, []);

  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {messagePopupState && (
            <MessageComponent
              open={messagePopupState}
              messageContent={message}
              setMessagePopupState={setMessagePopupState}
            />
          )}
          <div>
            <Grid
              key='outerGrid'
              className={styles.root}
              container
              justify='center'
            >
              {clubList.map(club => {
                return (
                  <Grid key={`innerGrid-${club["_id"]}`} item xs={12} md={3}>
                    <div className={styles.grid_card} key={club.id}>
                      <ClubCard club={club} />
                    </div>
                  </Grid>
                );
              })}
            </Grid>
          </div>
        </>
      )}
    </div>
  );
}
