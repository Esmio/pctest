import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.css';
import classnames from 'classnames';
import css from '../../styles/trendChart/TrendChartIndex.less';
import lessVar from '../../styles/variables.less';


class TrendChartIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barShow: true,
            buttonIndex: '0',
            subline: true,
            chartItemArr: [],
            missing: true,
            missingBar: true,
            trend: true,
            buttonNumber: '30'
        }
        this.handleBarShowClick = this.handleBarShowClick.bind(this)
        this.handleButtonClick = this.handleButtonClick.bind(this)
        this.handleOptionClick = this.handleOptionClick.bind(this)
        this.handleOpenNumberClick = this.handleOpenNumberClick.bind(this)
    }
    static defaultProps = {
        options: ['辅助线', '遗漏', '遗漏条', '走势'],
        openNumbers: ['30', '50', '100'],
        missingLines: ['出现总次数', '平均遗漏值', '最大遗漏值', '最大连出值'],
        tableDict: {
            '号码分布' : 'D',
            '跨度分布' : 'K'
        }
    }
    $(str) {
        return document.querySelector(str);
    }
    getGameId(){
        return  /Id=(.*)$/.exec(location.search)[1]
    }
    componentWillMount() {
        let gameUniqueId = this.getGameId();
        const { chartItemArr} = this.getDigitsAndBalls(gameUniqueId)
        this.setState({chartItemArr})
    }
    // 位和球
    getDigitsAndBalls(id) {
        let tabArr = [],
            chartItemArr = [],
            buttons = [],
            orgD = [],
            currentShowDigits = [],
            Func = {};
        switch (id) {
            case 'HF_CQSSC' :
            case 'HF_XJSSC' :
            case 'HF_TJSSC' :
            case 'HF_JXSSC' :
            case 'HF_LFSSC' :{
                tabArr = ['万位', '千位', '百位', '十位', '个位'];
                chartItemArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
                orgD = ['W', 'Q', 'B', 'S', 'G'];
                currentShowDigits= ['11111', '01111', '11100', '01110', '00111', '11000', '00011'];
                buttons = ['五星', '四星', '前三', '中三', '后三', '前二', '后二'];
                Func = this._renderPlayingResultsOfSSC.bind(this);
                break;
            }
            case 'HF_SHD11':
            case 'HF_GDD11':
            case 'HF_JXD11':
            case 'HF_SDD11':
            case 'HF_AHD11': {
                tabArr = ['万位', '千位', '百位', '十位', '个位'],
                chartItemArr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];
                orgD = ['W', 'Q', 'B', 'S', 'G'];
                currentShowDigits= ['11111'];
                buttons = ['五星走势图'];
                Func = this._renderPlayingResultsOfSSC.bind(this)
                break;
            }
            case 'X3D' : 
            case 'HF_SHSSL' : 
            case 'PL3' :{
                tabArr = ['百位', '十位', '个位'];
                chartItemArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
                orgD = ['B', 'S', 'G'];
                currentShowDigits= ['111', '110', '011'];
                buttons = ['三星', '前二', '后二'];
                Func = this._renderPlayingResultsOfX3D.bind(this)
                break;
            }
            case 'HF_AHK3':
            case 'HF_JSK3':
            case 'HF_GXK3': {
                tabArr = ['百位', '十位', '个位'];
                chartItemArr = ['1', '2', '3', '4', '5', '6'];
                orgD = ['B', 'S', 'G'];
                currentShowDigits= ['111'];
                buttons = ['快三走势图'];
                Func = this._renderPlayingResultsOfK3.bind(this)
                break;
            }
        }
        return { tabArr, chartItemArr, buttons, orgD, currentShowDigits, Func}
    }
    componentWillUnmount() {
        let $ = this.$;
        let canvas = $('canvas');
        canvas.remove();
    }
    componentDidMount() {
        window.onresize = ()=>{
            this.clear()
            this.restore()
        }
    }
    componentDidUpdate() {
        let {trend, missing} = this.state;
        let canvas = {}
        if (this.$('canvas')) {
            canvas = this.$('canvas')
            canvas.width = canvas.width;
            canvas.height = canvas.height;
        } else {
            canvas = document.createElement('canvas');
            let chart = this.$('#chart')
            chart.appendChild(canvas)
            canvas.style.position = 'absolute'
            canvas.width = this.refs.chart.offsetWidth;
            canvas.height = this.refs.chart.offsetHeight;
            canvas.style.top = '0px';
            canvas.style.left = '0px';
        }
        trend ? this.restore() : this.clear()
        missing ? this.renderAllMissing() : this.renderAllMissing(1) 
    }
    // canvas绘制
    draw(canvas, prefix){
        let ctx = canvas.getContext('2d');
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.strokeStyle = '#5891db';
        let { refs } = this
        for (let i = 0; ; i++) {
            let x = 0, y = 0, ele = refs[`${prefix}-${i}`];
            if (!ele) break;
            x = ele.offsetLeft + ele.clientWidth / 2;
            y = ele.offsetTop + ele.clientHeight / 2;
            if (i === 0) {
                ctx.moveTo(x, y)
            } else {
                ctx.lineTo(x, y)
            }
        }
        ctx.stroke();
        ctx.closePath();
    }
    // 清除画线
    clear(){
        let canvas = this.$('canvas')
        let ctx = canvas.getContext('2d')
        ctx.save()
        ctx.clearRect(0,0,canvas.width,canvas.height)
    }
    // 画线
    restore(){
        let canvas = this.$('canvas')
        canvas.width = this.refs.chart.offsetWidth;
        canvas.height = this.refs.chart.offsetHeight;
        let curDigitArr = this.getCurrentShowDigit()
        let {orgD} = this.getButtons()
        orgD.map((text, index)=>{
            let show = curDigitArr[index]
            if(show==='1') this.draw(canvas, text)
        })
    }
    // 单列遗漏
    renderMissings(digit, j, clear){
        let {buttonNumber, missing} = this.state
        let numbers = parseInt(buttonNumber, 10)
        let num = 1, times = 0, max = 0, seq = 0, maxSeq = 0;
        for(let i = 0; ;i++) {
            let str = `${digit}-${j}-${i}`
            const ele = this.refs[str]
            if(!ele) break;
            let child = ele.childNodes
            let itemIsText = ele.childNodes[0] && ele.childNodes[0].nodeName === '#text'
            if( clear === 1 && itemIsText){
                ele.innerText = '';
            // @ add missing did not check
            }else if(missing && (child.length === 0 || itemIsText)){
                ele.innerText = num
                max = max > num ? max : num 
                num++
                seq = 0
            }else{
                num = 1
                times++
                seq++
                maxSeq = maxSeq > seq ? maxSeq : seq;
            }
            let average = times === 0 ? numbers : parseInt(numbers/times)
            let dict = [times, average, max, maxSeq];
            dict.map((item, index)=>{
                let eleMinssing = this.refs[`M${digit}-${j}-${index}`]
                //@ TODO bug here
                clear === 1 ? eleMinssing.innerText = '' : eleMinssing.innerText = item
            })
        }
    }
    // missingBar
    drawMissingBar(digit, j, clear){
        let {missingBar, buttonNumber} = this.state
        let numbers = parseInt(buttonNumber, 10)
        for(let i = numbers-1; i >= 0; i--){
            let str = `${digit}-${j}-${i}`
            const ele = this.refs[str]
            if(!ele) break;
            let itemIsText = ele.childNodes[0] && ele.childNodes[0].nodeName === 'SPAN'
            if(itemIsText) break; 
            else{
                let color = j % 2 === 0 ? '#6fe6fb' : '#fef8ac'
                missingBar ? ele.style.backgroundColor = color : ele.style.backgroundColor = '#fff'
                ele.style.zIndex = '-1'
            }
        }
    }
    // table遗漏
    renderTableMissings(digit, clear){
        let gameUniqueId = this.getGameId();
        const {chartItemArr} = this.getDigitsAndBalls(gameUniqueId)
        for(let i = 0; i < chartItemArr.length; i++){
            this.renderMissings(digit, i, clear)
            this.drawMissingBar(digit, i, clear)
        }
    }
    // 渲染遗漏
    renderAllMissing(clear){
        let {orgD} = this.getButtons();
        let {buttonIndex} = this.state;
        let curDigitArr = this.getCurrentShowDigit()
        orgD.map((digit, index)=>{
            let show = curDigitArr[index]
            if(show === '1') this.renderTableMissings(digit, clear)
        })
        // 号码分布遗漏 
        this.renderTableMissings('D', clear)
        if(this.refs['K']) this.renderTableMissings('K', clear)
    }
    // 判断对象是否为空
    isEmpty(obj){
        for (var name in obj) 
        {
            return false;
        }
        return true;
    }
    // 渲染一行
    _renderTableRow(lineData, lineKey, num) {
        const { chartItemArr, subline } = this.state;
        const {tableDict } = this.props;
        let {orgD} = this.getButtons()
        let prefix = typeof num === 'number' ? orgD[num] : tableDict[num];
        let { openCode } = lineData;
        let openCodeArr = openCode.split(',');
        let { keyNum } = this.state;
        let showNum = openCodeArr[num];
        let curDigitArr = this.getCurrentShowDigit()
        const nodes = chartItemArr.map((item, index) => {
            const refStr = `${prefix}-${lineKey}`;
            const itemRef = `${prefix}-${index}-${lineKey}`
            let node = null;
            // 号码分布
            let repeatSave = [];
            if(num === '号码分布'){
                openCodeArr.map((open, j)=>{
                    let show = curDigitArr[j]
                    if(open == item && show==='1'){
                        if(this.refs[itemRef] && this.refs[itemRef].childNodes[0] && this.refs[itemRef].childNodes[0].nodeName==='#text') this.refs[itemRef].innerText = ''
                        let backgroundColor = repeatSave.indexOf(open) > -1 ? '#9a019a' : '#656565'
                        node = <span className={styles.showNum} ref={refStr} style={{backgroundColor}}>{open}</span>
                        repeatSave.push(open)
                    }
                })
            }else if(num === '跨度分布'){
                let arr = []
                openCodeArr.map((open, k)=>{
                    if(curDigitArr[k]==='1') arr.push(open)
                })
                let result = Math.abs(arr[0] - arr[1])
                if(result==item){
                    if(this.refs[itemRef] && this.refs[itemRef].childNodes[0] && this.refs[itemRef].childNodes[0].nodeName==='#text') this.refs[itemRef].innerText = ''
                    node = <span className={styles.showNum} ref={refStr}>{result}</span>
                }
            }else if(item == showNum){
                if(this.refs[itemRef] && this.refs[itemRef].childNodes[0] && this.refs[itemRef].childNodes[0].nodeName==='#text') this.refs[itemRef].innerText = ''
                node = <span className={styles.showNum} ref={refStr}>{item}</span>
            }
            // 清空背景色 清空遗漏
            if(this.refs[itemRef]){
                this.refs[itemRef].style.backgroundColor = ''
                this.refs[itemRef].style.zIndex = ''
            } 
            return <span className={styles.missingitem} ref={itemRef} key={index}>{node}</span>
        })
        return <div key={lineKey} className={subline ? classnames(styles.chartLine, styles.subline) : styles.chartLine}>{nodes}</div>
    }
    // 渲染遗漏行item
    _renderMissingTableLineItems(digit ,i){
        let {tableDict} = this.props
        let {orgD} = this.getButtons()
        let gameUniqueId = this.getGameId();
        const {chartItemArr} = this.getDigitsAndBalls(gameUniqueId)
        let nodes = chartItemArr.map((num, index)=>{
            let digitStr = typeof digit === 'number' ? orgD[digit] : tableDict[digit]
            let refStr = `M${digitStr}-${index}-${i}`
            return <span className={styles.missingheaditem} ref={refStr} style={{borderTop: 'none', borderBottom: 'none'}} key={index}></span>
        })
        return nodes
    }
    // 遗漏走势行
    _renderMissingTableLine(digit){
        let {missingLines} = this.props;        
        let lines = missingLines.map((text, index)=>{
            return <span className={styles.ballsSample} key={index}  style={{backgroundColor: '#e8eced', border:'1px solid #fff', height: '30px'}}>
                {this._renderMissingTableLineItems(digit, index)}
            </span>
        })
        return lines
    }
    // 渲染走势头行
    _renderTableHeadline(digit, reverse){
        let gameUniqueId = this.getGameId(); 
        const { tabArr, chartItemArr} = this.getDigitsAndBalls(gameUniqueId)
        let title = typeof digit === 'number' ? tabArr[digit] : digit
        let nodes = chartItemArr.map((num, index)=>{
            return <span className={reverse ? styles.headitemreverse :  styles.headitem } key={index}>{num}</span>
        })
        return <div className={reverse ? styles.chartHeaderReverse : styles.chartHeader}>
            <span className={styles.digit}>{title}</span>
            <span className={styles.ballsSample}>
                {nodes}
            </span>
        </div>
    }
    // 数组倒序
    reverseArray(arr){
        let length = arr.length
        let newArr = []
        while(length--){
            newArr.push(arr[length])
        }
        return newArr
    }
    // 整个图表
    _renderTableLines(digit) {
        let { resultsData, tableDict } = this.props;
        let span = ''
        resultsData = this.reverseArray(resultsData);
        if(digit==='跨度分布') span = 'K';
        const nodes = resultsData.map((item, lineKey) => {
            return this._renderTableRow(item, lineKey, digit)
        })
        return <div className={styles.table} key={`table-${digit}`} ref={span} >
            {this._renderTableHeadline(digit)}
            {nodes}
            {this._renderMissingTableLine(digit)}
            {this._renderTableHeadline(digit, true)}
        </div>
    }
    // 左侧line
    _renderPlanAndOpenCode(){
        let {resultsData, missingLines} = this.props;
        let curDigitArr = this.getCurrentShowDigit()
        const {subline} = this.state;
        resultsData = this.reverseArray(resultsData);
        let nodes = resultsData.map((item, index)=>{
            let {uniqueIssueNumber, openCode} = item;
            let openCodeArr = openCode.split(',');
            let nums = openCodeArr.map((num, index)=>{
                let show = curDigitArr[index]
                let color = show ==='1' ? 'red' : ''
                return <span style={{color, paddingRight: '2px', paddingLeft: '2px'}} key={`${index}`}>{num}</span>
            })
            return <span className={subline ? classnames(styles.regionStartLine, styles.subline) : styles.regionStartLine} key={index}>
                <span className={styles.issue}>{uniqueIssueNumber}</span>
                <span className={styles.openCode}>{nums}</span>
            </span>
        })
        let lines = missingLines.map((text, index)=>{
            return <span className={styles.regionStartLine} key={index}>
                <span className={styles.issue}>{text}</span>
                <span className={styles.blankitem}></span>
            </span>
        })
        return <div className={styles.regionStart}>
            <span className={styles.regionStartHeadline}>
                <span className={styles.issue}>期号</span><span className={styles.openCode}>开奖号码</span>
            </span>    
            {nodes}
            {lines}
            <span className={styles.regionStartHeadline}>
                <span className={styles.issue}>期号</span><span className={styles.openCode}>开奖号码</span>
            </span> 
        </div>
    }
    getButtons(){
        let gameUniqueId = this.getGameId()
        let {buttons, orgD, currentShowDigits} = this.getDigitsAndBalls(gameUniqueId)
        return {buttons, orgD, currentShowDigits}
    }
    // 按钮
    _renderButtons(){
        const {buttons} = this.getButtons();
        const {buttonIndex} = this.state;
        let nodes = buttons.map((button, index)=>{
            let backgroundColor = buttonIndex == index ? '' : '#ddd';
            return <span className={styles.button} key={index} style={{backgroundColor}} data-index={index} onClick={this.handleButtonClick}>{button}</span>
        })
        return nodes
    }
    handleButtonClick(e){
        let {index} = e.target.dataset;
        this.setState({buttonIndex: index})
    }
    // 隐藏功能区
    handleBarShowClick(){
        this.setState({barShow : !this.state.barShow})
    }
    _renderOptions(){
        const {options} = this.props
        let dict = ['subline', 'missing', 'missingBar', 'trend']
        let nodes = options.map((option, index)=>{
            let curItemStr = dict[index]
            return <span className={styles.option} key={index} data-index={index} onClick={this.handleOptionClick}><span className={this.state[curItemStr] ? classnames(styles.select,styles.yes) : styles.select}></span>{option}</span>
        })
        return nodes
    }
    _renderOpenNumberButtons(){
        const {openNumbers} = this.props;
        const {buttonNumber} = this.state
        let nodes = openNumbers.map((num, index)=>{
            let color = buttonNumber === num ? '#5891db' : '#ccc'
            return <span className={styles.option} key={index} data-numbers={num} style={{color}} onClick={this.handleOpenNumberClick}>最近{num}期</span>
        })
        return nodes
    }
    handleOpenNumberClick(e) {
        const {dispatch} = this.props
        let {numbers} = e.target.dataset
        let gameUniqueId = this.getGameId()
        this.setState({buttonNumber: numbers})
        dispatch({type: 'trend/getHistoryList', payload:{numbers ,gameUniqueId}})
    }
    handleOptionClick(e){
        while(!e.target.dataset.index){
            e.target = e.target.parentNode;
        }
        let { index } = e.target.dataset
        switch(index){
            case '0': {
                this.setState({subline: !this.state.subline})
                break;
            }
            case '1': {
                this.setState({missing: !this.state.missing})
                break;
            }
            case '2': {
                this.setState({missingBar: !this.state.missingBar})
                break;
            }
            case '3': {
                this.setState({trend: !this.state.trend})
                break;
            }
        }
    }
    // 显示当前的位数
    getCurrentShowDigit(){
        let {currentShowDigits} = this.getButtons()
        let {buttonIndex} = this.state
        let currentShowDigitStr = currentShowDigits[buttonIndex]
        return currentShowDigitStr.split('')
    }
    // 渲染每位图表
    _renderTables(){
        let gameUniqueId = this.getGameId()
        let {tabArr} = this.getDigitsAndBalls(gameUniqueId)
        let curDigitArr = this.getCurrentShowDigit()
        let nodes = tabArr.map((item, index)=>{
            let show = curDigitArr[index]
            return show === '1' ? this._renderTableLines(index) : null;
        })
        return nodes
    }
    getPlayingResult(codes, cur, title){
        let result = '';
        let numbers = []
        codes.map((code, j)=>{
            if(cur[j] === '1'){
                numbers.push(code)
            }
        })
        numbers.map((num, j)=>{
            num = parseInt(num)
            switch(title){
                case '大小形态' : {
                    result += num > 4 ? '大' : '小'
                    break;
                }
                case '单双形态' : {
                    result += num % 2 === 0 ? '双' : '单'
                    break;
                }
                case '质合形态' : {
                    result += this.isPrimeNumber(num) ? '质' : '合'
                    break;
                }
                case '012形态' : {
                    result += num % 3
                    break;
                }
                case '直选和值' : 
                case '和值' : {
                    result = result || 0
                    result += num
                    break;
                }
                case '和值尾数' : {
                    result = result || 0
                    result += num
                    if(j === numbers.length-1) result = result.toString().substr(-1)
                    break;
                }
            }
        })
        let leopard = numbers[0] === numbers[1] && numbers[1] === numbers[2]
        let combi2 = numbers[0] === numbers[1] || numbers[1] === numbers[2] || numbers[0] === numbers[2]
        let combi3 = numbers[0] !== numbers[1] && numbers[1] !== numbers[2] && numbers[0] !== numbers[2]
        switch(title){
            case '豹子' : {
                if(leopard) result = '√'
                break;
            }
            case '组三' : {
                if(combi2 && !leopard) result = '√'
                break;
            }
            case '组六' : {
                if(combi3) result = '√'
                break;
            }
            case '跨度' : {
                let arr = this.bubbling(numbers)
                result = arr[2] - arr[0];
                break;
            }
        }
        // 二位
        switch(title){
            case '对子' : {
                if(numbers[0]===numbers[1]) result = '√'
                break;
            }
        }
        return result
    }
    // 冒泡排序
    bubbling(arr){
        let length = arr.length
        for(let i = length-1; i >= 0 ; i--) {
            for(let j = 0; j < i; j++) {
                let num = arr[j]
                if(arr[j] > arr[j+1]) {
                    arr[j] = arr[j+1]
                    arr[j+1] = num
                }
            }
        }
        return arr
    }
    // 判断质数
    isPrimeNumber(num){
        if(num === 0) return false;
        if(num === 1 || num === 2) return true;
        let divisor = Math.floor(num/2)
        if(divisor===1) return true;
        for(let i = 2; i <= divisor; i++){
            if(num % i === 0){
                return false
            }
        }
        return true
    }
    // 不同玩法展示项
    _renderPlayingResults(title, i){
        let {resultsData, missingLines} = this.props;
        let curDigitArr = this.getCurrentShowDigit()
        const {subline} = this.state;
        resultsData = this.reverseArray(resultsData);
        let leopard = 1
        let nodes = resultsData.map((item, index)=>{
            let {openCode} = item;
            let openCodeArr = openCode.split(',');
            let result = this.getPlayingResult(openCodeArr, curDigitArr, title)
            if(title === '豹子' || title === '对子'){
                if(result === ''){
                    result = leopard
                    leopard++
                }else{
                    leopard = 1
                }  
            }
            let color = title === '豹子' || title=== '对子' ? '#aaa' : ''
            if(result==='√') color = ''
            return <span className={subline ? classnames(styles.regionStartLine, styles.subline) : styles.regionStartLine} style={{backgroundColor: 'rgba(13,202,174, .7)',color}} key={index}>
                <span className={styles.openCode}>{result}</span>
            </span>
        })
        let lines = missingLines.map((text, index)=>{
            return <span className={styles.regionStartLine} key={index}>
                <span className={styles.blankitem}></span>
            </span>
        })
        return <div className={styles.regionAddItem} key={i}>
            <span className={styles.regionStartHeadline}>
                <span className={styles.openCode}>{title}</span>
            </span>  
            {nodes}
            {lines}
            <span className={styles.regionStartHeadline}>
                <span className={styles.openCode}>{title}</span>
            </span> 
        </div>
    }
    // 时时彩前三、中三、后三
    _renderPlayingResultsOfSSC(){
        let {buttonIndex} = this.state
        if(buttonIndex==='2'||buttonIndex==='3'||buttonIndex==='4'){
            let dict = ['大小形态', '单双形态', '质合形态', '012形态', '豹子', '组三', '组六', '跨度', '直选和值', '和值尾数']
            let nodes = dict.map((item, index)=>{
                return this._renderPlayingResults(item, index)
            })
            return nodes
        }else if(buttonIndex==='5' || buttonIndex==='6'){
            let dict = ['跨度分布', '对子', '和值']
            let nodes = dict.map((item, index)=>{
                return item === '跨度分布' ? this._renderTableLines(item) :  this._renderPlayingResults(item, index)
            })
            return nodes
        }else{
            return null
        }
    }
    _renderPlayingResultsOfK3(){
        let dict = ['豹子','和值', '对子']
        let nodes = dict.map((item, index)=>{
            return this._renderPlayingResults(item, index)
        })
        return nodes
    }
    _renderPlayingResultsOfX3D(){
        let {buttonIndex} = this.state
        if(buttonIndex==='0'){
            let dict = ['大小形态', '单双形态', '质合形态', '012形态', '豹子', '组三', '组六', '跨度', '直选和值', '和值尾数']
            let nodes = dict.map((item, index)=>{
                return this._renderPlayingResults(item, index)
            })
            return nodes
        }else if(buttonIndex==='1' || buttonIndex==='2'){
            let dict = ['跨度分布', '对子', '和值']
            let nodes = dict.map((item, index)=>{
                return item === '跨度分布' ? this._renderTableLines(item) :  this._renderPlayingResults(item, index)
            })
            return nodes
        }else{
            return null
        }
    }
    render() {
        let { resultsData } = this.props;
        let {barShow} = this.state;
        let gameUniqueId = this.getGameId()
        let {Func} = this.getDigitsAndBalls(gameUniqueId);
        if(this.isEmpty(resultsData)) return null;
        return (
            <div className={styles.normal}>
                <div className={styles.title}>历史号码走势</div>
                <div className={styles.bar}>
                    {this._renderButtons()}
                    <span className={styles.button} onClick={this.handleBarShowClick}>{barShow ? '隐藏' : '显示'}功能区</span>
                </div>
                <div className={styles.bar} style={{display: this.state.barShow ? 'flex' : 'none'}}>
                    {this._renderOptions()}
                    {this._renderOpenNumberButtons()}
                </div>
                <div className={styles.chart} id="chart" ref="chart">
                    {this._renderPlanAndOpenCode()}
                    {this._renderTables()}
                    {this._renderTableLines('号码分布')}
                    {Func()}
                </div>
            </div>
        );
    }
}
function mapStatesToProps(state){
    const {resultsData} = state.trend
    return {resultsData}
}
export default connect(mapStatesToProps)(TrendChartIndex)
