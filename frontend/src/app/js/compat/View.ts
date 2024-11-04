export class View {
    static showPreloader(){
        $('.loader').removeClass('loader--visibility');
    }
    static hidePreloader(){
        $('.loader').addClass('loader--visibility');
    }
}

