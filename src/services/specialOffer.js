import { request } from '../utils/';

export async function getSpecialOfferList(){
	return request(`http://192.168.1.93:7000/api/v1/cms/internal/promotion?contentType=PC_PROMOTION&adminId=31`)
}