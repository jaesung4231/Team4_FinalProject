import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Card, CardContent, CardActions, CardMedia,Typography, IconButton} from '@material-ui/core';
import {Favorite, FavoriteBorder} from '@material-ui/icons';

import SnackbarMsg from './snackmsg';

const styles = (theme) => ({
	content : {},
	layout : {
		display : 'flex',
		justifyContent : 'center'
	},
	card: {
		minWidth: 275,
		maxWidth: 600,
		marginBottom : 20,
		marginLeft : 'auto',
		marginRight : 'auto',
	},
});



class MusicListLiked extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			likes : {},
			snackbar : {},
		};
	}

	toggleFavorite = (id, collectionCensoredName) => () => {
		let {likes} = this.state;

		if(likes[id] === undefined) {
			likes[id] = true;
			console.log(id, likes[id]);
		}
		else {
			likes[id] = (likes[id]) ? true : false;
		}

		// fetch(`/musicSearch/${this.state.searchWord}`).then(r => r.json()).then(r => {
		// 	console.log(r);
		// 	this.setState({music_list : r, searchWord : ''});
		// }).catch(e => console.log('error when search musician'));

		fetch('/like', {
			method: 'post',
			body: JSON.stringify({
				id: id,
				collectionCensoredName : collectionCensoredName,
				status: likes[id]
			})
		})
			.then(res => res.json())
			.then(r => {
				console.log(r);
			}).catch(e => console.log('error'));

		// 	.then(res => {f
		// 	this.setState({likes[id] : true});
		// })

		// let db = firebase.firestore();
		// db.collection('likes').doc(String(id)).set({like : likes[id]});

		/*
		try {
				let ref = db.collection('likes').doc(String(id));
				ref.get().then((doc) => {
						if (doc.exists) {
								console.log('document data : ', doc.data());
						}
						else {
								console.log('No Such Document')
						}
				}).catch((e) => {
						console.log('Error while accessing Firestore : ' + e);
				});
		}
		catch (e) {
				console.log('Error Occurred : '+ e);
		} */


		this.setState({likes, snackbar : {open : true, msg : `${collectionCensoredName} (id : ${id}) clicked`}});
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
						<Card key={item.collectionId} className={classes.card}>
							{/*<CardActionArea>*/}
							<CardMedia >
								<img src={item.artworkUrl100} style={{width:150, height:150}}/>
							</CardMedia>
							<CardContent>
								<Typography gutterBottom variant="subtitle1"> {item.artistName}</Typography>
								<Typography variant="body2"> {item.collectionCensoredName}</Typography>
							</CardContent>
							{/*</CardActionArea>*/}
							<CardActions>
								<IconButton onClick={this.toggleFavorite(item.collectionId, item.collectionCensoredName)}>
									{this.state.likes[item.collectionId] ? <Favorite /> : <FavoriteBorder />}
								</IconButton>
							</CardActions>
						</Card>)
				})}
				<SnackbarMsg open={this.state.snackbar.open} message={this.state.snackbar.msg} onClose={this.handleSnackbarClose}/>
			</div>
		);
	}
}

export default withStyles(styles)(MusicListLiked);
