import { createSlice } from '@reduxjs/toolkit';

import CONTRACT_ABI from '../../abis/AnimalCertificate.json';

const contractSlice = createSlice({
    name: 'contract',
    initialState: {
        abi: CONTRACT_ABI.abi,
        address: '0xb88D94FD88a7EFee0637918392C693695B6EE047',
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
