import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Card, CardContent, CardActions, CardMedia,Typography, IconButton} from '@material-ui/core';
import {Favorite, FavoriteBorder} from '@material-ui/icons';

//import firebase from './firebase';
import SnackbarMsg from './snackmsg';

const styles = (theme) => ({
    content : {},
    layout : {
        display : 'flex',
        justifyContent : 'center'
    },
    card: {
        display: 'flex',
        //justifyContent : 'center',
        minWidth: 275,
        maxWidth: 600,
        marginBottom : 20,
        marginLeft : 'auto',
        marginRight : 'auto',
    },
    right: {
        display: 'flex',
        justifyContent : 'flex-end',
      }
});

/*const theme = createTheme({
    typography: {
      subtitle1: {
        fontSize: 12,
        fontWeight: 500,
      },
    },
  });*/


class MusicList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            likes : {},
            snackbar : {},
        };
    }

    toggleFavorite = (trackId, collectionName, artistName, primaryGenreName,trackCensoredName, artworkUrl100) => () => {
        let id = trackId;
        let {likes} = this.state;

        if(likes[id] === undefined) {
            likes[id] = true;
        }
        else {
            likes[id] = (likes[id]) ? false : true;
        }

        console.log("trackId : " + id + ", 좋아요 상태 : "+ likes[id], "collectionName"+collectionName+"artistName"+artistName+"primaryGenreName"+primaryGenreName+"trackCensoredName"+trackCensoredName);

        fetch(`/like/${id}`, {
            method: 'post',
            headers:{'Content-Type': 'application/json' },
            body: JSON.stringify({
                "collectionName" : collectionName,
                "artistName" : artistName,
                "primaryGenreName" : primaryGenreName,
                "trackCensoredName": trackCensoredName,
                "artworkUrl100":artworkUrl100,
                "status": likes[id]
            })
        })
          .then(res => res.json())
          .then(res => {
              console.log(res);
          })
          .catch(e => console.log('error'));


        // try {
        //     let ref = db.collection('likes').doc(String(id));
        //     ref.get().then((doc) => {
        //         if (doc.exists) {
        //             console.log('document data : ', doc.data());
        //         }
        //         else {
        //             console.log('No Such Document')
        //         }
        //     }).catch((e) => {
        //         console.log('Error while accessing Firestore : ' + e);
        //     });
        // }
        // catch (e) {
        //     console.log('Error Occurred : '+ e);
        // }


        this.setState({likes, snackbar : {open : true, msg : `${trackCensoredName} (id : ${id}) clicked`}});
    }

    handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
          }

          this.setState({snackbar : {open : false, msg : ''}});
    }

    render () {
        const {classes} = this.props;
        return (
            <div>
                {this.props.list.results.map(item => {
                    return (
                    <Card elevation={5} key={item.trackId} className={classes.card}>
                        {/*<CardActionArea>*/}
                            <CardMedia>
                                <img src={item.artworkUrl100} style={{width:150, height:150}} hspace={10} vspace={10}/>
                            </CardMedia>

                            <CardContent>
                                {/* <Typography gutterBottom variant="subtitle1"> {item.artistName}</Typography>
                                <Typography variant="body2"> {item.trackCensoredName}</Typography> */}
                                <Typography color="primary" gutterBottom variant="subtitle1"> {item.trackCensoredName}</Typography>
                                <Typography variant="body2">가수명: {item.artistName}</Typography>
                                <Typography variant="body2">앨범명: {item.collectionName}</Typography>
                                <Typography variant="body2">장르: {item.primaryGenreName}</Typography>
                            </CardContent>

                        {/*</CardActionArea>*/}
                       
                    </Card>)
                })}
                <SnackbarMsg open={this.state.snackbar.open} message={this.state.snackbar.msg} onClose={this.handleSnackbarClose}></SnackbarMsg>
            </div>
        );
    }
}

export default withStyles(styles)(MusicList);
