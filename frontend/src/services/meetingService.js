import { get, post } from './httpClient';

export const meetingService = {
    // UC14: Pregled svih sastanaka
    getAll: () => get('/api/meetings'),
    // UC10: Kreiranje novog sastanka
    create: (data) => post('/api/meetings/newMeeting', data),
    // UC12: Objavljivanje
    publish: (id) => post(`/api/meetings/${id}/publish`, {}),
    // UC21: Potvrda sudjelovanja
    confirmParticipation: (id) => post(`/api/meetings/${id}/participate`, {}),
    // UC18: Dodavanje točke dnevnog reda (ako se dodaje naknadno)
    addItem: (meetingId, itemData) => post(`/api/meetings/${meetingId}/items`, itemData),
    
    remove: (id) => post(`/api/meetings/${id}/delete`, {}),
    archive: (id) => post(`/api/meetings/${id}/archive`, {}),

    finish: (id) => post(`/api/meetings/${id}/finish`, {}),
    updateItemConclusion: (mId, itemNum, data) => post(`/api/meetings/${mId}/items/${itemNum}/conclusion`, data)
        
};