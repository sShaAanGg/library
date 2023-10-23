import logout

def test_logout():
    # Arrange
    # Not needed

    # Act & Assert
    logout.main()

    # The following elements should not show up
    # get_by_role("main").get_by_text("Hi! shang")
    # get_by_text("帳號： shang112522105")
    # get_by_role("button", name="登出")
