import { createSlice } from '@reduxjs/toolkit';

import CONTRACT_ABI from '../../abis/AnimalCertificate.json';

const contractSlice = createSlice({
    name: 'contract',
    initialState: {
        abi: CONTRACT_ABI.abi,
        address: '0xA6F6876334c18E483597a31d011d0C044325Bab3',
    },
    reducers: {
        setAbi: (state, action) => {
            state.data = action.payload;
        },
        setAddress: (state, action) => {
            state.data = action.payload;
        },
        
    },
});

export const { setAbi, setAddress } = contractSlice.actions;
export default contractSlice.reducer;
