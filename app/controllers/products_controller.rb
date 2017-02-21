class ProductsController < ApplicationController

    def index
        @products = Product.all

        respond_to do |format|
            format.json { render json: @products }
        end
    end

    def show
        @product = Product.find(params[:id])

        respond_to do |format|
            format.json { render json: @product }
        end
    end

    def create
        @product = Product.create(product_params)

        respond_to do |format|
            format.json { render json: @product }
        end
    end

    def update
        @product = Product.find(params[:id])

        @product.update_attributes(product_params);

        respond_to do |format|
            format.json { render json: @product }
            # format.json { head :no_content }
        end
    end

    def destroy
        @product = Product.find(params[:id])

        @product.destroy

        respond_to do |format|
            format.json { render json: @product }
            # format.json { head :no_content }
        end
    end

    private
        def product_params
            params.require(:product).permit(:name, :price, :quantity)
        end
end
