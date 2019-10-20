import React from 'react';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text, Toast, Root } from 'native-base';
import RNFetchBlob from 'rn-fetch-blob';
import { dataStorage } from '../storage';
import AsyncStorage from '@react-native-community/async-storage';
import { isEmail, isPhoneNumber } from '../utils/functionUtil';
import { Navigation } from 'react-native-navigation';
import { LIST } from '../navigation/ScreensMap';

export default class Register extends React.Component {
    name = '';
    phone = '';
    mail = '';
    address = '';

    onchangeName = (text) => {
        this.name = text;
    };

    onchangePhone = (text) => {
        this.phone = text;
    };

    onchangeEmail = (text) => {
        this.mail = text;
    };

    onchangeAddress = (text) => {
        this.address = text;
    };

    submitForm = async () => {

        if (this.name.length === 0) {
            Toast.show({
                text: 'Vui lòng nhập tên ',
                buttonText: 'Okay',
                duration: 3000
            });
            return
        }
        if (!this.phone) {
            Toast.show({
                text: 'Vui lòng nhập một số điện thoại hợp lệ ',
                buttonText: 'Okay',
                duration: 3000
            });
            return
        }
        if (!isEmail(this.mail)) {
            Toast.show({
                text: 'Vui lòng nhập một địa chỉ email hợp lệ ',
                buttonText: 'Okay',
                duration: 3000
            });
            return
        }
        const formData = [
            { name: 'name', data: this.name },
            { name: 'mobile', data: this.phone.toString() },
            { name: 'email', data: this.mail },
            { name: 'address', data: this.address }
        ];
        RNFetchBlob.fetch('POST', 'http://novaenergy.vn/plugin/api/v1/customer_register', {
            // Authorization: 'Bearer access-token',
            // otherHeader: 'foo',
            'Content-Type': 'form-data'
        }, formData).then((resp) => {
            const json = resp.json();
            console.log(json);
            if (json.code === 200 && json.response) {
                // pushSingleScreen('root', )
                dataStorage.token = json.response;
                AsyncStorage.setItem('auth_key', json.response);
                Navigation.setRoot({
                    root: {
                        stack: {
                            id: 'stack',
                            children: [{
                                component: {
                                    name: LIST,
                                    options: {
                                        topBar: {
                                            title: {
                                                text: 'NOVA ENERGY'
                                            },
                                            elevation: 1
                                        },
                                        statusBar: {
                                            style: 'dark'
                                        }
                                    }
                                }
                            }]
                        }
                    }
                });
            } else {
                alert('response' + json)
                Toast.show({
                    text: 'Đã xảy ra lỗi khi đăng kí. Vui lòng thử lại',
                    buttonText: 'Okay',
                    duration: 3000
                });
            }
        }).catch((err) => {
            console.log(err);
            alert(err)
            Toast.show({
                text: 'Đã xảy ra lỗi khi đăng kí. Vui lòng thử lại',
                buttonText: 'Okay',
                duration: 3000
            });
        });
    };

    render() {
        return (
            <Root>
                <Container style={{ paddingHorizontal: 24 }}>
                    <Content >
                        <Item stackedLabel style={{ marginTop: 24 }}>
                            <Label>Họ tên </Label>
                            <Input onChangeText={this.onchangeName}/>
                        </Item>
                        <Item stackedLabel style={{ marginTop: 24 }}>
                            <Label>Số điện thoại </Label>
                            <Input onChangeText={this.onchangePhone}/>
                        </Item>
                        <Item stackedLabel style={{ marginTop: 24 }}>
                            <Label>Email </Label>
                            <Input onChangeText={this.onchangeEmail}/>
                        </Item>
                        <Item stackedLabel style={{ marginTop: 24 }}>
                            <Label>Địa chỉ </Label>
                            <Input
                                multiline
                                numberOfLines={4}
                                onChangeText={this.onchangeAddress}
                            />
                        </Item>

                        <Button block info style={{ marginTop: 24, marginBottom: 24 }} onPress={this.submitForm}>
                            <Text>Bắt đầu </Text>
                        </Button>
                    </Content>
                </Container>
            </Root>
        );
    }
}
