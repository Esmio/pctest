import { request } from '../utils/';

export async function resultsRecord(params){
	let {gameUniqueId, numbers} = params
	numbers = numbers || 30
	return request(`/api/v1/result/service/mobile/results/hist/${gameUniqueId}?limit=${numbers}`)
}