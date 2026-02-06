const translations = {
    en: {
        'status': 'Status',
        'im_ok': 'I\'m OK',
        'im_not_ok': 'I\'m Not OK',
        'tap_to_speak': 'Tap to Speak',
        'you_can_say': 'You can say ‘I’m OK’ or ‘I’m not OK’',
        'didnt_catch_that': 'Sorry, I didn’t catch that. Are you OK?',
        'pending': 'Pending',
        'ok': 'OK',
        'overdue': 'Overdue',
        'outside_checkin_window': 'Outside check-in window'
    },
    ms: {
        'status': 'Status',
        'im_ok': 'Saya OK',
        'im_not_ok': 'Saya Tidak OK',
        'tap_to_speak': 'Ketik untuk Bercakap',
        'you_can_say': 'Anda boleh sebut ‘Saya OK’ atau ‘Saya tidak OK’',
        'didnt_catch_that': 'Maaf, saya tidak faham. Adakah anda OK?',
        'pending': 'Menunggu',
        'ok': 'OK',
        'overdue': 'Tertunggak',
        'outside_checkin_window': 'Di luar waktu daftar masuk'
    },
    ta: {
        'status': 'நிலை',
        'im_ok': 'நான் நலம்',
        'im_not_ok': 'நான் நலமில்லை',
        'tap_to_speak': 'பேச தட்டவும்',
        'you_can_say': 'நீங்கள் ‘நான் நலம்’ அல்லது ‘நான் நலமில்லை’ என்று சொல்லலாம்',
        'didnt_catch_that': 'மன்னிக்கவும், எனக்கு புரியவில்லை. நீங்கள் நலமா?',
        'pending': 'காத்திருக்கிறது',
        'ok': 'சரி',
        'overdue': 'காலக்கெடு முடிந்தது',
        'outside_checkin_window': 'செக்-இன் நேரத்திற்கு வெளியே'
    },
    zh: {
        'status': '状态',
        'im_ok': '我很好',
        'im_not_ok': '我不好',
        'tap_to_speak': '点击说话',
        'you_can_say': '你可以说‘我很好’或‘我不好’',
        'didnt_catch_that': '抱歉，我没听清楚。你还好吗？',
        'pending': '待定',
        'ok': '好的',
        'overdue': '逾期',
        'outside_checkin_window': '在登记入住时间之外'
    }
};

let currentLanguage = 'en';

export function setLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.dispatchEvent(new CustomEvent('language-changed-internal'));

}

export function getLocalizedString(key) {
    return translations[currentLanguage][key] || key;
}

export function getLanguage() {
    return currentLanguage;
}
