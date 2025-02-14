import * as apiRequest from '~/utils/apiRequest';

export const getArticle = async (req, res) => {
    try {
        const response = await apiRequest.get('/writer');
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json(error);
    }
};
