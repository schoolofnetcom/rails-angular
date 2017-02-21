class HomeController < ApplicationController
    def index
    end

    def hello
        @str = { txt: 'Hello', name: 'Leonan' }

        respond_to do |format|
            format.json { render json: @str }
        end
    end
end
