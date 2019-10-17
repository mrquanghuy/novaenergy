import React, { Component } from 'react';
import { Container, Header, Content, Form, Item, Picker, Label, Input, Button, Text, Toast, Root } from 'native-base';
import Icon from 'react-native-vector-icons';
import RNFetchBlob from 'rn-fetch-blob';
import { dataStorage } from '../storage';
import { pushSingleScreen } from '../navigation';
import { DETAIL } from '../navigation/ScreensMap';
import { Keyboard } from 'react-native';

export default class Calculate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            province: null,
            area: null,
            pin_type: null,
            kind: null,
            type: null,
            roof: null
        };
    }

    onValueProvince = (value) => {
        this.setState({
            province: value
        });
    };

    onValueArea = (value) => {
        this.setState({
            area: value
        });
    };

    onValuePinType = (value) => {
        this.setState({
            pin_type: value
        });
    };

    onValueKind = (value) => {
        this.setState({
            kind: value
        });
    };

    onValueType = (value) => {
        this.setState({
            type: value
        });
    };

    onValueRoof = (value) => {
        this.setState({
            roof: value
        });
    };

    submitForm = async () => {
        Keyboard.dismiss();
        const formData = [
            { name: 'province', data: this.state.province.toString() },
            { name: 'area', data: this.state.area.toString() },
            { name: 'pin_type', data: this.state.pin_type.toString() },
            { name: 'model_usage', data: this.state.kind.toString() },
            { name: 'roof', data: this.state.roof.toString() },
            { name: 'electric_type', data: this.state.type.toString() },
            { name: 'key_auth', data: dataStorage.token }
        ];
        RNFetchBlob.fetch('POST', 'http://novaenergy.vn/plugin/api/v1/caculator_power', {
            // Authorization: 'Bearer access-token',
            // otherHeader: 'foo',
            'Content-Type': 'form-data'
        }, formData).then((resp) => {
            console.log(resp);
            const json = resp.json();
            console.log(json);
            if (json.code === 200 && json.response) {
                // pushSingleScreen('root', )
                const url = 'http://novaenergy.vn/plugin/api/v1/result_report?key_auth=' + dataStorage.token + '&prefix=' + json.response;
                pushSingleScreen('stack', DETAIL, '', { uri: url }, false);
            } else {
                Toast.show({
                    text: 'Đã xảy ra lỗi khi đăng kí. Vui lòng thử lại',
                    buttonText: 'Okay',
                    duration: 3000
                });
            }
        }).catch((err) => {
            console.log(err);
        });
    };

    render() {
        return (
            <Root>
                <Container>
                    <Content>
                        <Form style={{ marginHorizontal: 24 }}>
                            <Item picker style={{ marginLeft: 0, marginTop: 30 }}>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    style={{ width: undefined }}
                                    placeholder="Select your SIM"
                                    placeholderStyle={{ color: '#bfc6ea' }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.province}
                                    onValueChange={this.onValueProvince}
                                >
                                    <Picker.Item label="Chọn khu vực lắp đặt" value="" />
                                    {
                                        province.map((item, index) => {
                                            return <Picker.Item label={item[index + 1]} value={index + 1} key={index.toString()}/>
                                        })
                                    }
                                </Picker>
                            </Item>
                            <Item stackedLabel style={{ marginLeft: 0, marginTop: 30 }}>
                                <Label style={{ marginLeft: 8, color: '#000' }}>Diện tích mái khả dụng (m2)</Label>
                                <Input type={'number'} onChangeText={this.onValueArea}/>
                            </Item>
                            <Item picker style={{ marginTop: 30 }}>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    style={{ width: undefined }}
                                    placeholder="Loại tấm "
                                    placeholderStyle={{ color: '#bfc6ea' }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.pin_type}
                                    onValueChange={this.onValuePinType}
                                >
                                    <Picker.Item label="Loại tấm " value="" />
                                    {
                                        pin_type.map((item, index) => {
                                            return <Picker.Item label={item[Object.keys(item)[0]]} value={Object.keys(item)[0]} key={index.toString()}/>
                                        })
                                    }
                                </Picker>
                            </Item>
                            <Item picker style={{ marginTop: 30 }}>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    style={{ width: undefined }}
                                    placeholder="Loại điện áp"
                                    placeholderStyle={{ color: '#bfc6ea' }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.type}
                                    onValueChange={this.onValueType}
                                >
                                    <Picker.Item label="Loại điện áp" value="" />
                                    {
                                        type.map((item, index) => {
                                            return <Picker.Item label={item[index + 1]} value={item[index + 1]} key={index.toString()}/>
                                        })
                                    }
                                </Picker>
                            </Item>
                            <Item picker style={{ marginTop: 30 }}>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    style={{ width: undefined }}
                                    placeholder="Mô hình sử dụng điện"
                                    placeholderStyle={{ color: '#bfc6ea' }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.kind}
                                    onValueChange={this.onValueKind}
                                >
                                    <Picker.Item label="Mô hình sử dụng điện" value="" />
                                    {
                                        model_usage.map((item, index) => {
                                            return <Picker.Item label={item[Object.keys(item)[0]]} value={item[Object.keys(item)[0]]} key={index.toString()}/>
                                        })
                                    }
                                </Picker>
                            </Item>
                            <Item picker style={{ marginTop: 30 }}>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    style={{ width: undefined }}
                                    placeholder="Hướng mái"
                                    placeholderStyle={{ color: '#bfc6ea' }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.roof}
                                    onValueChange={this.onValueRoof}
                                >
                                    <Picker.Item label="Hướng mái" value="" />
                                    {
                                        huongMai.map((item, index) => {
                                            return <Picker.Item label={item[index + 1]} value={index + 1} key={index.toString()}/>
                                        })
                                    }
                                </Picker>
                            </Item>
                        </Form>
                        <Button block info style={{ marginHorizontal: 24, marginVertical: 30 }} onPress={this.submitForm}>
                            <Text>Tính Toán</Text>
                        </Button>
                    </Content>
                </Container>
            </Root>
        );
    }
}

const province = [{ 1: 'Hà Nội' },
    { 2: 'TP.HCM' },
    { 3: 'An Giang' },
    { 4: 'Bà Rịa -Vũng Tàu' },
    { 5: 'Bắc Cạn' },
    { 6: 'Bắc Giang' },
    { 7: 'Bắc Ninh' },
    { 8: 'Bạc Liêu' },
    { 9: 'Bến Tre' },
    { 10: 'Bình Định' },
    { 11: 'Bình Dương' },
    { 12: 'Bình Phước' },
    { 13: 'Bình Thuận' },
    { 14: 'Cà Mau' },
    { 15: 'Cần Thơ' },
    { 16: 'Cao Bằng' },
    { 17: 'Đà Nẵng' },
    { 18: 'Đắc Lắc' },
    { 19: 'Đắc Nông' },
    { 20: 'Điện Biên' },
    { 21: 'Đồng Nai' },
    { 22: 'Đồng Tháp' },
    { 23: 'Gia Lai' },
    { 24: 'Hà Giang' },
    { 25: 'Hà Nam' },
    { 26: 'Hà Tĩnh' },
    { 27: 'Hải Dương' },
    { 28: 'Hải Phòng' },
    { 29: 'Hậu Giang' },
    { 30: 'Hòa Bình' },
    { 31: 'Hưng Yên' },
    { 32: 'Khánh Hòa' },
    { 33: 'Kiên Giang' },
    { 34: 'Kon Tum' },
    { 35: 'Lai Châu' },
    { 36: 'Lâm Đồng' },
    { 37: 'Lạng Sơn' },
    { 38: 'Lào Cai' },
    { 39: 'Long An' },
    { 40: 'Nam Định' },
    { 41: 'Nghệ An' },
    { 42: 'Ninh Bình' },
    { 43: 'Ninh Thuận' },
    { 44: 'Phú Yên' },
    { 45: 'Phú Thọ' },
    { 46: 'Quảng Bình' },
    { 47: 'Quảng Nam' },
    { 48: 'Quảng Ngãi' },
    { 49: 'Quảng Ninh' },
    { 50: 'Quảng Trị' },
    { 51: 'Sóc Trăng' },
    { 52: 'Sơn La' },
    { 53: 'Tây Ninh' },
    { 54: 'Thái Bình' },
    { 55: 'Thái Nguyên' },
    { 56: 'Thanh Hóa' },
    { 57: 'Thừa Thiên - Huế' },
    { 58: 'Tiền Giang' },
    { 59: 'Trà Vinh' },
    { 60: 'Tuyên Quang' },
    { 61: 'Vĩnh Long' },
    { 62: 'Vĩnh Phúc' },
    { 63: 'Yên Bái' }];

// pin_type
const pin_type = [
    { '40W': 'MONO 40W' },
    { '50W': 'MONO 50W' },
    { '60W': 'MONO 60W' },
    { '100W': 'MONO 100W' },
    { '150W': 'MONO 150W' },
    { '200W': 'MONO 200W' },
    { '250W': 'MONO 250W' },
    { '260W': 'MONO 260W' },
    { '270W': 'MONO 270W' },
    { '270W': 'MONO 330W' },
    { '345W': 'MONO 345W' },
    { '400W': 'MONO 400W' },
    { '60W_poly': 'POLY 60W' },
    { '100W_poly': 'POLY 100W' },
    { '150W_poly': 'POLY 150W' },
    { '260W_poly': 'POLY 260W' },
    { '325W_poly': 'POLY 325W' },
    { '330W_poly': 'POLY 330W' }];

// model_usage
const model_usage = [{ hoa_luot: 'Hoà lưới' }, { doc_lap: 'Độc lập' }];

// roof
const huongMai = [
    { 1: 'Đông' },
    { 2: 'Tây' },
    { 3: 'Nam' },
    { 4: 'Bắc' },
    { 5: 'Đông Bắc' },
    { 6: 'Tây Nam' },
    { 7: 'Tây Bắc' },
    { 8: 'Đông Nam' }
];

// electric_type

const type = [{ 1: '1 pha 220V' }, { 2: '3 pha 380V' }];
