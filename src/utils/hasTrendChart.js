function hasTrendChart(id) {
	switch (id) {
        case 'HF_CQSSC' :
        case 'HF_XJSSC' :
        case 'HF_TJSSC' :
        case 'HF_JXSSC' :
        case 'HF_LFSSC' :
        case 'HF_SHD11' :
        case 'HF_GDD11' :
        case 'HF_JXD11' :
        case 'HF_SDD11' :
        case 'HF_AHD11' : 
        case 'X3D' : 
        case 'HF_SHSSL' : 
        case 'PL3' :
        case 'HF_AHK3':
        case 'HF_JSK3':
        case 'HF_GXK3': {
            return true;
        }
        default : {
            return false;
        }
    }
}

export { hasTrendChart };
