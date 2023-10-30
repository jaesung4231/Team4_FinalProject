import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent : 'center',
    minWidth: 275,
    maxWidth: 700,
    marginBottom : 20,
    marginLeft : 'auto',
    marginRight : 'auto',
    //alignItems: 'center',
},
  details: {
    display: 'flex',
    flexDirection: 'column',
},
  content: {
    flex: '1 0 auto',
},
  cover: {
    width: 80,
    height:80,
},
  controls: {
    display: 'flex',
    justifyContent : 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
},
}));

export default function ChartList(props) {
  const classes = useStyles();
  const theme = useTheme();

  return (
        props.list.map((item,Num)=>{
            return(
            <div>
            <Card className={classes.root}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5">
                        {++Num}위 : {item.title}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        아티스트 : {item.artist}
                    </Typography>
                </CardContent>
            </div>
            <CardMedia
                className={classes.cover}
                image={item.img}
                title={item.title}
            />
        </Card>
        </div>
        );})
    );    
};

