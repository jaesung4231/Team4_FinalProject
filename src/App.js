import React from 'react';
//import './App.css';
//import PropTypes from 'prop-types';
//import { withStyles } from '@material-ui/core/styles';
//import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import {AppBar, Typography, TextField, Button, Input, Map, Box, Tab, Tabs} from '@material-ui/core';
//import Toolbar from '@material-ui/core/Toolbar';
//import MenuIcon from '@material-ui/icons/Menu';
//import IconButton from '@material-ui/core/IconButton';
//import ExitToApp from '@material-ui/icons/ExitToApp';
//import Drawer from '@material-ui/core/Drawer';
//import Forms from './Forms';
//import HomeIcon from '@material-ui/icons/Home';
//import Typography from '@material-ui/core/Typography';
import MusicList from './MusicList';
import music_list from './data';
import chart_list from './chart_data';
import ChartList from './ChartList';
import FavoriteList from './FavoriteList';
/*chart_list : chart_list,*/
import SearchIcon from "@material-ui/icons/Search";
import IconButton from '@material-ui/core/IconButton';



export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // music_list : music_list,
            music_list : {}, // props 키 값 때문에 에러나서 바꿨어요
            searchWord : '',
            chart_list : chart_list,
            favorite_list: {},
            value : 0

        }
    }

    handleSearchTextChange = (event) => {
        //console.log(event.target.value);
        this.setState({searchWord : event.target.value});
    }

    handleSearch = (event) => {
        event.preventDefault();
        console.log(this.state.searchWord);
        //this.setState({searchWord : ''});
        fetch(`/musicSearch/${this.state.searchWord}`).then(r => r.json()).then(r => {
            console.log(r);
            this.setState({music_list : r, searchWord : ''});
        }).catch(e => {
            console.log('error when search musician')
            //let Search_result=music_list.results.filter(value=>value.artistName.indexOf(this.state.searchWord)!=-1 || value.trackCensoredName.indexOf(this.state.searchWord) !=-1);
            //let Search_result=music_list.results.filter(value=>value.trackCensoredName.indexOf(this.state.searchWord)!=-1 || value.artistName.indexOf(this.state.searchWord) !=-1);
            let Search_result=music_list.results.filter(value=>value.trackCensoredName.indexOf(this.state.searchWord)!=-1 || value.artistName.indexOf(this.state.searchWord) !=-1 || value.primaryGenreName.indexOf(this.state.searchWord) !=-1 || value.collectionName.indexOf(this.state.searchWord) !=-1);
            Search_result={resultCount: Search_result.length,results:Search_result};
            console.log(Search_result);
            this.setState({music_list : Search_result, searchWord:''});
        });

    }

    handleFavorite = (event) => {
            fetch(`http://localhost:3000/favorite`).then(r=>r.json()).then(r=>{
                console.log(r);
                this.setState({favorite_list : r});
            }).catch(e => {
                console.log("error favorite")
                console.log(favorite_list);
                });
    }

    UpdateChart = (event) => {
     
        fetch('/charts').then(r => r.json()).then(r => {
            console.log(r);
            this.setState({chart_list : r});

        }).catch(e => {
            console.log('error when update Chart')
            console.log(chart_list);
            this.setState({chart_list : chart_list});
        });

    }

    a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    handleChange = (event, newValue) => {
        this.setState({ value: newValue });
    }

    render () {
        return (
            <div>
            <AppBar position="fixed" >
                {/*<Typography align="center" variant="h3" color="inherit">Your Favorite Musics</Typography>*/}
                <Tabs value={this.state.value} onChange={this.handleChange} aria-label="simple tabs example" indicatorColor="primary" centered>
                    <Tab label="Search Musics" {...this.a11yProps(0)} />
                    <Tab label="Your Favorite Musics" {...this.a11yProps(1)} onClick={this.handleFavorite}/>
                    <Tab label="Chart" {...this.a11yProps(2)} onClick={this.UpdateChart} />
                </Tabs>
            </AppBar>

                <TabPanel value={this.state.value} index={0}>
                    <Typography align="center" variant="h3" color="inherit" style ={{marginTop:30}}>Search Musics</Typography>
                    <div style={{height: 60, width: '100%'}}></div>
                    <form style={{display: 'flex', marginBottom : 20}}>

                        <div style={{display : 'flex', marginLeft : 'auto', marginRight : 'auto',}}>
                            <TextField variant="outlined" label="Music Search" type="search" style={{width : 450}}
                                       onChange={this.handleSearchTextChange} value={this.state.searchWord}>

                            </TextField>
                            <Button variant="contained" color="primary" type="submit" onClick={this.handleSearch} style={{marginLeft : 20}} endIcon={<SearchIcon />}>
                                search
                            </Button>
                        </div>

                    </form>

                    { this.state.music_list.results && this.state.music_list.results.length > 0 &&
                    <MusicList list={this.state.music_list}>

                    </MusicList>
                    }

                </TabPanel>

                <TabPanel value={this.state.value} index={1}>
                        {this.state.favorite_list.results && this.state.favorite_list.results.length > 0 &&
                            <FavoriteList list={this.state.favorite_list}>
                            </FavoriteList>
                        }
                   
                </TabPanel>

                <TabPanel value={this.state.value} index={2}>
                    <Typography align="center" variant="h3" color="inherit" style ={{marginTop:30}}>실시간 ituens 인기신곡 </Typography>
                    <ChartList list={this.state.chart_list}>
                    </ChartList>

                </TabPanel>
            </div>
        );
    }
}

class TabPanel extends React.Component {
    render() {
        return (
          <Typography component="div" hidden={this.props.value !== this.props.index}>
              <Box p={3}>{this.props.children}</Box>
          </Typography>
        );
    }
}
//
