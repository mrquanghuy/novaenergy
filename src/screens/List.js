import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Row, H3, Text, Left, Body, Right, Button } from 'native-base';
import RNFetchBlob from 'rn-fetch-blob';
import { getDateStringWithFormat } from '../utils/dateTime';
import {FlatList, RefreshControl, View} from 'react-native';
import { pushSingleScreen } from '../navigation';
import { CALCULATE, DETAIL } from '../navigation/ScreensMap';
import { dataStorage } from '../storage';

export default class ListThumbnailExample extends Component {
    state = {
        isLoading: true,
        dataSource: []
    };

    componentDidMount() {
        this.getdata();
    }

    getdata = async () => {
        RNFetchBlob.fetch('GET', 'http://novaenergy.vn/plugin/api/v1/list_report?key_auth=' + dataStorage.token)
            .then((resp) => {
                console.log(resp);
                const json = resp.json();
                if (json.code === 200) {
                    this.setState({
                        isRefreshing: false,
                        isLoading: false,
                        dataSource: json.response || []
                    });
                } else {
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    show = (item) => () => {
        const url = 'http://novaenergy.vn/plugin/api/v1/result_report?key_auth=' + dataStorage.token + '&prefix=' + item.prefix;
        pushSingleScreen('stack', DETAIL, '', { uri: url });
    };

    calculate = () => {
        pushSingleScreen('stack', CALCULATE, 'NOVA ENERGY')
    };

    refreshList = () => {
        this.setState({
            isRefreshing: true
        }, this.getdata)
    };

    renderItem = ({item, index}) => {
        return <ListItem thumbnail key={item.id.toString()} style={{ marginRight: 32 }}>
            <Body>
                <Text>Sản lượng: {item.total} KWh</Text>
                <Text note numberOfLines={1}>
                    {getDateStringWithFormat(item.created_at * 1000, 'DD/MM/YYYY HH:mm:ss')}
                </Text>
            </Body>
            <Right>
                <Button transparent onPress={this.show(item)}>
                    <Text>Xem</Text>
                </Button>
            </Right>
        </ListItem>;
    };

    render() {
        if (this.state.isLoading) {
            return (
                <Container style={{ paddingTop: 30 }}>
                    <Content>
                        <View
                            style={{
                                paddingHorizontal: 24,
                                width: '100%',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <H3 style={{ flex: 1 }}>Lịch sử tính toán</H3>
                            <Button info style={{ alignSelf: 'flex-end' }} onPress={this.calculate}>
                                <Text>Tính toán</Text>
                            </Button>
                        </View>
                    </Content>
                </Container>
            )
        }
        return (
            <Container style={{ paddingTop: 30 }}>
                <View
                    style={{
                        paddingHorizontal: 24,
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <H3 style={{ flex: 1 }}>Lịch sử tính toán</H3>
                    <Button info rounded style={{ alignSelf: 'flex-end', height: 36 }} onPress={this.calculate}>
                        <Text>Tính toán</Text>
                    </Button>
                </View>
                <FlatList
                    style={{flex: 1}}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.refreshList}
                            progressViewOffset={80}
                        />
                    }
                    refreshing={this.state.isRefreshing}
                    data={this.state.dataSource}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => item.id.toString()}
                />
            </Container>
        );
    }
}
